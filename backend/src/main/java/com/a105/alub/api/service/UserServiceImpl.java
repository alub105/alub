package com.a105.alub.api.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.GithubTokenReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.GithubTokenRes;
import com.a105.alub.api.response.GithubUserRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.MyInfoRes;
import com.a105.alub.config.GithubConfig;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.enums.Platform;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.security.GitHubAuthenticate;
import com.a105.alub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final GithubConfig githubConfig;
  private final UserRepository userRepository;
  private final GitHubAuthenticate gitHubAuthenticate;

  WebClient webClient = WebClient.builder().baseUrl("https://github.com")
      .defaultHeader("CONTENT-TYPE", "application/json").defaultHeader("Accept", "application/json")
      .build();

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

    log.info("User Details: {}", userDetails);

    String token = gitHubAuthenticate.getJwtToken(userDetails, loginReq.getPlatform());
    return LoginRes.builder().userId(user.getId()).name(user.getName()).email(user.getEmail())
        .imageUrl(user.getImageUrl()).token(token).build();
  }

  /**
   * 사용자가 설정한 설정값 조회
   * 
   * @param username user 이름
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
   * @param username user 이름
   * @param configsReq 재설정할 설정값을 담은 객체
   */
  @Override
  public void updateConfigs(Long userId, ConfigsReq configsReq) {
    User user = userRepository.findById(userId).orElseThrow(RuntimeException::new);

    // commit 설정
    if (configsReq.getCommit() != null) {
      user.setCommit(configsReq.getCommit());
    } else if (configsReq.getTimerDefaultTime() != null) { // 기본 시간 설정
      user.setTimerDefaultTime(configsReq.getTimerDefaultTime());
    } else { // 타이머 보일지 여부 설정
      user.setTimerShown(configsReq.isTimerShown());
    }

    userRepository.save(user);
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

  @Override
  public MyInfoRes getMyInfo(Long userId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException());
    return MyInfoRes.builder().userId(user.getId()).email(user.getEmail()).name(user.getName())
        .imageUrl(user.getImageUrl()).build();
  }

  /**
   * github의 user 정보 가져오기
   * 
   * @param githubAccessToken user 정보가져오기 위한 access_token
   * @return github 유저 정보
   */
  private GithubUserRes getGithubUser(String githubAccessToken) {
    return webClient.get().uri("https://api.github.com/user")
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

    return webClient.post().uri("/login/oauth/access_token").bodyValue(githubTokenReq).retrieve()
        .bodyToMono(GithubTokenRes.class).block();
  }

}
