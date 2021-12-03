package com.a105.alub.api.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.a105.alub.api.request.FileListGetReq;
import com.a105.alub.api.response.FileGetRes;
import com.a105.alub.api.response.GithubFileContentRes;
import com.a105.alub.api.response.UserSearchDto;
import com.a105.alub.common.exception.FileNotFoundException;
import com.a105.alub.common.exception.TokenForbiddenException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.domain.specs.UserSpecs;
import com.a105.alub.domain.specs.UserSpecs.SearchKey;
import com.google.common.net.HttpHeaders;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

  private final UserRepository userRepository;
  private final WebClient githubApiClient;

  @Override
  public List<UserSearchDto> searchWith(Map<SearchKey, Object> searchKeys) {
    return userRepository.findAll(UserSpecs.searchWith(searchKeys))
        .stream().map(UserSearchDto::of).collect(Collectors.toList());
  }

  /**
   * 다른 user의 Study 파일 List 조회
   *
   * @param fileListGetReq Get의 userId와 FilePath들을 모은 요청
   * @return
   */
  @Override
  public List<FileGetRes> getFileList(FileListGetReq fileListGetReq) {
    User user =
        userRepository.findById(fileListGetReq.getUserId()).orElseThrow(UserNotFoundException::new);
    StringBuilder uri = new StringBuilder("/repos/{userName}/{repoName}/contents");

    Map<String, String> uriPathVariables = new HashMap<>();
    uriPathVariables.put("userName", user.getName());
    uriPathVariables.put("repoName", user.getRepoName());
    String dirPath = user.getDirPath() == null ? "" : user.getDirPath();
    if (!dirPath.equals("")) {
      uri.append("/{dirPath}");
      uriPathVariables.put("dirPath", dirPath);
    }
    uri.append("/{site}");
    uriPathVariables.put("site", fileListGetReq.getSite().toString());
    uri.append("/{problemNum}");
    uriPathVariables.put("problemNum", fileListGetReq.getProblemNum());

    try {
      List<GithubFileContentRes> fileNameList = getFileNameList(user, uri, uriPathVariables);
      List<GithubFileContentRes> fileList = getFileList(user, uri, uriPathVariables, fileNameList);
      List<FileGetRes> fileListRes = new LinkedList<FileGetRes>();
      fileList.stream().forEach(file -> {
        fileListRes.add(new FileGetRes(file));
      });
      log.info("Sucess Get FileList from : {}", getUrl(uriPathVariables));

      return fileListRes;
    } catch (Exception e) {
      log.info("Fail Get FileList from: {}", getUrl(uriPathVariables));
      throw new FileNotFoundException();
    }
  }

  /**
   * github repo 내부의 문제번호 폴더 안에 있는 파일명 조회
   *
   * @param user 요청한 유저
   * @param uri github api 요청을 위한 uriTemplate
   * @param uriPathVariables uriTemplate에 넣을 variables
   * @return 파일 정보
   */
  private List<GithubFileContentRes> getFileNameList(User user, StringBuilder uri,
      Map<String, String> uriPathVariables) {
    try {

      List<GithubFileContentRes> response =
          githubApiClient.get().uri(uri.toString(), uriPathVariables)
              .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken()).retrieve()
              .onStatus(status -> status == HttpStatus.NOT_FOUND,
                  clientResponse -> clientResponse.createException()
                      .flatMap(it -> Mono.error(new FileNotFoundException())))
              .onStatus(status -> status == HttpStatus.FORBIDDEN,
                  clientResponse -> clientResponse.createException()
                      .flatMap(it -> Mono.error(new TokenForbiddenException())))
              .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                  clientResponse -> clientResponse.bodyToMono(String.class)
                      .map(body -> new RuntimeException(body)))
              .bodyToMono(new ParameterizedTypeReference<List<GithubFileContentRes>>() {}).block();

      if (response.size() == 0) {
        throw new FileNotFoundException();
      }

      return response;
    } catch (Exception e) {
      throw new FileNotFoundException();
    }
  }

  /**
   * github repo 내부의 문제번호 폴더 안에 있는 파일들 조회
   *
   * @param user 요청한 유저
   * @param uri github api 요청을 위한 uriTemplate
   * @param uriPathVariables uriTemplate에 넣을 variables
   * @return 파일 정보
   */
  private List<GithubFileContentRes> getFileList(User user, StringBuilder uri,
      Map<String, String> uriPathVariables, List<GithubFileContentRes> fileNameList) {
    uri.append("/{fileName}");
    List<GithubFileContentRes> fileList = new LinkedList<GithubFileContentRes>();

    fileNameList.stream().forEach(entity -> {
      uriPathVariables.put("fileName", entity.getName());
      try {
        GithubFileContentRes response = githubApiClient.get().uri(uri.toString(), uriPathVariables)
            .header(HttpHeaders.AUTHORIZATION, "token " + user.getGithubAccessToken()).retrieve()
            .onStatus(status -> status == HttpStatus.NOT_FOUND,
                clientResponse -> clientResponse.createException()
                    .flatMap(it -> Mono.error(new FileNotFoundException())))
            .onStatus(status -> status == HttpStatus.FORBIDDEN,
                clientResponse -> clientResponse.createException()
                    .flatMap(it -> Mono.error(new TokenForbiddenException())))
            .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                clientResponse -> clientResponse.bodyToMono(String.class)
                    .map(body -> new RuntimeException(body)))
            .bodyToMono(GithubFileContentRes.class).block();
        fileList.add(response);
      } catch (Exception e) {
      }
    });
    return fileList;
  }

  /**
   * 작업한 github url 받아오기
   *
   * @param uriPathVariables url 값들을 모아놓은 Map
   * @return 작업한 url
   */
  private String getUrl(Map<String, String> uriPathVariables) {
    StringBuilder uri = new StringBuilder();
    uri.append(uriPathVariables.get("userName"));
    String dirPath = uriPathVariables.getOrDefault("dirPath", "");
    if (!dirPath.equals("")) {
      uri.append("/" + dirPath);
    }
    uri.append("/" + uriPathVariables.get("repoName"));
    uri.append("/" + uriPathVariables.get("site"));
    uri.append("/" + uriPathVariables.get("problemNum"));
    return uri.toString();
  }
}
