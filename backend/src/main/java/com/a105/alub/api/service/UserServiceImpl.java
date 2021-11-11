package com.a105.alub.api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import com.a105.alub.api.request.CommitReq;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.GitHubCommitReq;
import com.a105.alub.api.request.GithubTokenReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.request.RepoCreateReq;
import com.a105.alub.api.request.RepoSetReq;
import com.a105.alub.api.response.CommitRes;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.GithubContentType;
import com.a105.alub.api.response.GithubRepo;
import com.a105.alub.api.response.GithubRepoRes;
import com.a105.alub.api.response.GithubTokenRes;
import com.a105.alub.api.response.GithubUserRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.MyInfoRes;
import com.a105.alub.api.response.Readme;
import com.a105.alub.api.response.RepoContent;
import com.a105.alub.api.response.GithubRepoContentRes;
import com.a105.alub.common.exception.AlreadyExistingRepoException;
import com.a105.alub.common.exception.CommitFileNameException;
import com.a105.alub.common.exception.DirSettingFailException;
import com.a105.alub.common.exception.RepoNotFoundException;
import com.a105.alub.common.exception.TimerFormatException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.config.GithubConfig;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.enums.CommitType;
import com.a105.alub.domain.enums.Platform;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.security.GitHubAuthenticate;
import com.a105.alub.security.UserPrincipal;
import com.google.common.net.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final GithubConfig githubConfig;
  private final UserRepository userRepository;
  private final GitHubAuthenticate gitHubAuthenticate;
  private final WebClient githubApiClient;

  /**
   * github 인증하고 user 저장 후 user 정보 전달
   * 
   * @param loginReq github code와 platform이 담긴 객체
   * @return user 정보와 jwt 담긴 객체 반환
   */
  @Override
  public LoginRes login(LoginReq loginReq) {

    GithubTokenRes githubTokenRes = getAccessToken(loginReq.getCode());
    log.info("Github Access Token Response: {}", githubTokenRes);

    GithubUserRes githubUserRes = getGithubUser(githubTokenRes.getAccessToken());

    User user = gitHubAuthenticate.checkUser(githubTokenRes, githubUserRes);

    UserDetails userDetails = loadUserByUsername(user.getName(), loginReq.getPlatform());

    String token = gitHubAuthenticate.getJwtToken(userDetails, loginReq.getPlatform());
    return LoginRes.builder().userId(user.getId()).name(user.getName()).email(user.getEmail())
        .imageUrl(user.getImageUrl()).token(token).build();
  }

  /**
   * 사용자가 설정한 설정값 조회
   *
   * @param userId 유저 ID
   * @return 설정값들을 담은 객체 반환
   */
  @Override
  public ConfigsRes getConfigs(Long userId) {

    User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);

    return ConfigsRes.builder().commit(user.getCommit())
        .timerDefaultTime(user.getTimerDefaultTime()).timerShown(user.getTimerShown())
        .repoName(user.getRepoName()).dirPath(user.getDirPath()).build();
  }

  /**
   * 설정값 update하기
   *
   * @param userId 유저 ID
   * @param configsReq 재설정할 설정값을 담은 객체
   */
  @Override
  public void updateConfigs(Long userId, ConfigsReq configsReq) {
    User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);

    // commit 설정
    if (configsReq.getCommit() != null) {
      user.setCommit(configsReq.getCommit());
    } else if (configsReq.getTimerDefaultTime() != null) { // 기본 시간 설정
      String time = checkTimeFormat(configsReq.getTimerDefaultTime());
      user.setTimerDefaultTime(time);
    } else { // 타이머 보일지 여부 설정
      user.setTimerShown(configsReq.isTimerShown());
    }

    userRepository.save(user);
  }

  private String checkTimeFormat(String time) {
    final String REGEX = "([0-9]){2}(:[0-5][0-9]){2}";
    
    if(!time.matches(REGEX)) {
      throw new TimerFormatException("입력한 형식이 올바르지 않습니다.");
    }
    
    return time;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByName(username)
        .orElseThrow(() -> new UsernameNotFoundException(username));
    return UserPrincipal.create(user);
  }

  @Override
  public UserDetails loadUserByUsername(String username, Platform platform)
      throws UsernameNotFoundException {
    User user = userRepository.findByName(username)
        .orElseThrow(() -> new UsernameNotFoundException(username));
    return UserPrincipal.create(user, platform);
  }

  /**
   * github의 user 정보 가져오기
   * 
   * @param githubAccessToken user 정보가져오기 위한 access_token
   * @return github 유저 정보
   */
  private GithubUserRes getGithubUser(String githubAccessToken) {
    return githubApiClient.get().uri("/user")
        .header("Authorization", "token " + githubAccessToken).retrieve()
        .bodyToMono(GithubUserRes.class).block();
  }

  /**
   * code를 통해 github access_token 받아오기
   * 
   * @param code github에서 제공하는 인증 code (?)
   * @return GithubTokenRes
   */
  private GithubTokenRes getAccessToken(String code) {
    GithubTokenReq githubTokenReq = GithubTokenReq.builder().code(code)
        .clientId(githubConfig.getClientId()).clientSecret(githubConfig.getClientSecret()).build();

    log.info("Github Access Token Request: {}", githubTokenReq);

    return githubApiClient.post().uri("https://github.com/login/oauth/access_token")
        .bodyValue(githubTokenReq).retrieve()
        .bodyToMono(GithubTokenRes.class).block();
  }

  /**
   * 내정보 가져오기
   *
   * @param userId user ID
   * @return user 정보
   */
  @Override
  public MyInfoRes getMyInfo(Long userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException());
    return MyInfoRes.builder().userId(user.getId()).email(user.getEmail()).name(user.getName())
        .imageUrl(user.getImageUrl()).build();
  }

  /**
   * 특정 유저 github의 모든 public repo 리스트 조회
   * @param userId 유저 ID
   * @return
   */
  @Override
  public List<GithubRepoRes> getGithubPublicRepos(Long userId) {
    User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

    int resSize = 0;
    int page = 1;
    List<GithubRepo> githubRepos = new ArrayList<>();
    do {
      List<GithubRepo> resRepos = githubApiClient.get()
          .uri("/user/repos?visibility=public&affiliation=owner&per_page=100&page={page}", page++)
          .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
          .retrieve()
          .onStatus(status -> status == HttpStatus.NOT_FOUND,
              clientResponse -> clientResponse.createException()
                  .flatMap(it -> Mono.error(new RepoNotFoundException())))
          .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
              clientResponse -> clientResponse.bodyToMono(String.class)
                  .map(body -> new RuntimeException(body)))
          .bodyToFlux(GithubRepo.class)
          .collectList().blockOptional().orElse(new ArrayList<>());

      githubRepos.addAll(resRepos);
      resSize = resRepos.size();
    } while (resSize != 0);

    return githubRepos.stream()
        .filter(e -> !e.getFork())
        .map(GithubRepoRes::of)
        .collect(Collectors.toList());
  }

  /**
   * alub repo 설정
   * @param userId 유저 ID
   * @param repoSetReq repo 설정 관련 request 데이터
   */
  @Override
  public void setAlubRepo(Long userId, RepoSetReq repoSetReq) {
    User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

    String repoName = repoSetReq.getRepoName();
    String dirPath = repoSetReq.getDirPath();

    if (repoSetReq.isCreation()) {
      createGithubPublicRepo(user, repoName);
      createReadmeInRepoDir(user, repoName, dirPath);
    } else {
      setExistingGithubRepoToAlubRepo(user, repoName, dirPath);
    }

    user.updateAlubRepo(repoName, dirPath);
    userRepository.save(user);
  }

  /**
   * github public repo 생성
   * @param user 유저
   * @param repoName 생성할 repo 이름
   */
  private void createGithubPublicRepo(User user, String repoName) {
    RepoCreateReq repoCreateReq = new RepoCreateReq(repoName);
    GithubRepo createdRepo = githubApiClient.post()
        .uri("/user/repos")
        .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(repoCreateReq)
        .retrieve()
        .onStatus(status -> status == HttpStatus.UNPROCESSABLE_ENTITY,
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new AlreadyExistingRepoException()))
        .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new RuntimeException(body)))
        .bodyToMono(GithubRepo.class)
        .block();
  }

  /**
   * 유저 자신이 소유한 특정 github repo 조회
   * @param userId 유저 ID
   * @param repoName 조회할 repo 이름
   */
  @Override
  public GithubRepoRes getGithubRepo(Long userId, String repoName) {
    User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

    int resSize = 0;
    int page = 1;
    List<GithubRepo> githubAllRepos = new ArrayList<>();
    do {
      List<GithubRepo> reposPerPage = githubApiClient.get()
          .uri("/user/repos?affiliation=owner&per_page=100&page={page}", page++)
          .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
          .retrieve()
          .onStatus(status -> status == HttpStatus.NOT_FOUND,
              clientResponse -> clientResponse.createException()
                  .flatMap(it -> Mono.error(new RepoNotFoundException())))
          .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
              clientResponse -> clientResponse.bodyToMono(String.class)
                  .map(body -> new RuntimeException(body)))
          .bodyToFlux(GithubRepo.class)
          .collectList().blockOptional().orElse(new ArrayList<>());

      githubAllRepos.addAll(reposPerPage);
      resSize = reposPerPage.size();
    } while (resSize != 0);

    githubAllRepos = githubAllRepos.stream()
        .filter(githubRepo -> githubRepo.getName().equalsIgnoreCase(repoName))
        .collect(Collectors.toList());

    int numOfGithubRepo = githubAllRepos.size();
    if (numOfGithubRepo > 1) {
      throw new IllegalStateException();
    } else if (numOfGithubRepo == 0) {
      throw new RepoNotFoundException();
    }

    return GithubRepoRes.of(githubAllRepos.get(0));
  }

  /**
   * 이미 존재하는 github repo를 alub repo로 설정
   * @param user 유저
   * @param repoName alub repo로 설정할 이미 존재하는 github repo 이름
   * @param dirPath alub repo로 설정할 directory 경로
   */
  private void setExistingGithubRepoToAlubRepo(User user, String repoName, String dirPath) {
    List<RepoContent> repoContents = getRepoContents(user, repoName, dirPath);
    if (repoContents.size() <= 0) {
      // dirPath/README.md 생성
      createReadmeInRepoDir(user, repoName, dirPath);
    } else {
      RepoContent firstContent = repoContents.get(0);
      GithubContentType githubContentType = firstContent.getType();
      String contentFullName = firstContent.getPath();

      if (!contentFullName.equals(dirPath) && githubContentType == GithubContentType.FILE) {
        if (!getReadmeInRepoDir(user, repoName, dirPath).isPresent()) {
          createReadmeInRepoDir(user, repoName, dirPath);
        }
      } else {
        // repo 설정 불가
        throw new DirSettingFailException();
      }
    }
  }

  /**
   * github repo의 특정 경로에 README.md 생성
   * @param user 유저
   * @param repoName README.md 생성할 repo 이름
   * @param dirPath README.md 생성할 경로
   * @return
   */
  public boolean createReadmeInRepoDir(User user, String repoName, String dirPath) {
    String readmeContent = "# Alub \r\n원 클릭을 통한 문제 풀이 코드 업로드";
    Readme readme = new Readme("Create README.md by Alub", readmeContent);

    // dirPath가 root("")일 경우를 위해 String.format() 사용
    String url = String
        .format("/repos/%s/%s/contents/%s/README.md", user.getName(), repoName, dirPath);

    RepoContent repoContents = githubApiClient.put()
        .uri(url)
        .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
        .bodyValue(readme)
        .retrieve()
        .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new RuntimeException(body)))
        .bodyToMono(RepoContent.class).block();

    return true;
  }

  /**
   * 특정 github repo의 contents 목록 조회
   * @param user 유저
   * @param repoName contents를 조회할 repo 이름
   * @param dirPath contents를 조회할 경로
   * @return
   */
  private List<RepoContent> getRepoContents(User user, String repoName, String dirPath) {
    List<RepoContent> repoContents = githubApiClient.get()
        .uri("/repos/{userName}/{repoName}/contents/{dirPath}",
            user.getName(), repoName, dirPath)
        .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
        .retrieve()
        .onStatus(status -> (status.is4xxClientError() && status != HttpStatus.NOT_FOUND)
                || status.is5xxServerError(),
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new RuntimeException(body)))
        .bodyToFlux(RepoContent.class)
        .onErrorResume(WebClientResponseException.NotFound.class, notFound -> Mono.empty())
        .collectList().blockOptional().orElse(new ArrayList<>());

    return repoContents;
  }

  /**
   * github repo의 특정 경로의 README.md 조회
   * @param user 유저
   * @param repoName README.md를 조회할 repo 이름
   * @param dirPath README.md를 조회할 경로
   * @return
   */
  private Optional<RepoContent> getReadmeInRepoDir(User user, String repoName, String dirPath) {
    Optional<RepoContent> readme = githubApiClient.get()
        .uri("/repos/{userName}/{repoName}/readme/{dirPath}",
            user.getName(), repoName, dirPath)
        .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken())
        .retrieve()
        .onStatus(status -> (status.is4xxClientError() && status != HttpStatus.NOT_FOUND)
                || status.is5xxServerError(),
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new RuntimeException(body)))
        .bodyToMono(RepoContent.class)
        .onErrorResume(WebClientResponseException.NotFound.class, notFound -> Mono.empty())
        .blockOptional();
    return readme;
  }

  @Override
  public CommitRes commit(Long id, CommitReq commitReq) {
    User user = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    String url = String.format("/repos/%s/%s/contents/%s/%s/%s", user.getName(), user.getRepoName(),
        user.getDirPath(), commitReq.getSite(), commitReq.getProblemNum());

    GitHubCommitReq gitHubCommitReq = new GitHubCommitReq(commitReq);
    log.info(gitHubCommitReq.toString());

    try {
      Long cnt = getCommitCnt(url, user.getGithubAccessToken(), commitReq.getProblemNum());
      String fileName = getFileName(commitReq, cnt);

      url += "/" + fileName;
      log.info("url: {}", url);
      githubApiClient.put().uri(url).bodyValue(gitHubCommitReq)
          .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken()).retrieve()
          .onStatus(status -> status == HttpStatus.NOT_FOUND,
              clientResponse -> clientResponse.createException()
                  .flatMap(it -> Mono.error(new RepoNotFoundException())))
          .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
              clientResponse -> clientResponse.bodyToMono(String.class)
                  .map(body -> new RuntimeException(body)))
          .toEntity(String.class).block();

      log.info("Commit complete: {}", url);
      return new CommitRes(url);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }

  }

  /**
   * code를 통해 github repo에서 파일명 최댓값 받아오기
   *
   * @param repo github repo, repo 내부 dir 경로
   * @return 최댓값+1
   */
  private Long getCommitCnt(String url, String token, String problemNum) {
    Long cnt = 1L;
    try {

      List<GithubRepoContentRes> response = githubApiClient.get().uri(url)
          .header(HttpHeaders.AUTHORIZATION, "token " + token).retrieve()
          .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
              clientResponse -> clientResponse.bodyToMono(String.class)
                  .map(body -> new RuntimeException(body)))
          .bodyToMono(new ParameterizedTypeReference<List<GithubRepoContentRes>>() {}).block();

      Pattern pattern = Pattern.compile("^" + problemNum + "_\\d+\\b");
      String maxFileName = response.stream().filter(entry -> {
        Matcher matcher = pattern.matcher(entry.getName());
        return matcher.find();
      }).max((entry1, entry2) -> {
        Matcher matcher1 = pattern.matcher(entry1.getName());
        Matcher matcher2 = pattern.matcher(entry2.getName());
        matcher1.find();
        matcher2.find();
        StringTokenizer st1 = new StringTokenizer(matcher1.group(), "_");
        StringTokenizer st2 = new StringTokenizer(matcher2.group(), "_");
        st1.nextToken();
        st2.nextToken();
        return Long.parseLong(st1.nextToken()) > Long.parseLong(st2.nextToken()) ? 1 : -1;
      }).get().getName();

      Matcher matcher = pattern.matcher(maxFileName);
      matcher.find();
      StringTokenizer st = new StringTokenizer(matcher.group(), "_");
      st.nextToken();
      cnt = Long.parseLong(st.nextToken()) + 1L;
    } catch (Exception e) {
      // 파일이 없는 경우 첫 번째 커밋이기 때문에 아무것도 하지 않고 1을 return
    }
    return cnt;
  }

  private String getFileName(CommitReq commitReq, Long cnt) {
    String fileName = "";

    if (commitReq.getCommit() == CommitType.CUSTOM) {
      if (commitReq.getFileName() == null) {
        throw new CommitFileNameException("filaName이 잘못 되었습니다.");
      }
      fileName = commitReq.getFileName();
    } else {
      fileName = commitReq.getProblemNum() + "_" + cnt;
    }
    fileName += "." + commitReq.getLanguage();

    return fileName;
  }

}
