package com.a105.alub.api.controller;

import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.request.RepoSetReq;
import com.a105.alub.api.response.GithubRepoRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.service.UserService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.security.CurrentUser;
import com.a105.alub.security.UserPrincipal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@Slf4j
@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PostMapping("/authenticate")
  public ApiResponseDto<LoginRes> login(@RequestBody LoginReq loginReq) {
    LoginRes loginResponse = userService.login(loginReq);
    log.info("Login Response: {}", loginResponse);

    return ApiResponseDto.success(loginResponse);
  }

  @GetMapping("/repos")
  public ApiResponseDto<List<GithubRepoRes>> getGithubPublicRepos(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal) {

    List<GithubRepoRes> githubRepoResList = userService.getGithubPublicRepos(userPrincipal.getId());
    log.info("GET /repos - response : {}, userId : {}", githubRepoResList.toArray(),
        userPrincipal.getId());
    return ApiResponseDto.success(githubRepoResList);
  }

  @PutMapping("/repos")
  public ApiResponseDto<String> setAlubRepo(@RequestBody RepoSetReq repoSetReq,
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal) {
    log.info("PUT /repos - request : {}, userId : {}", repoSetReq.toString(),
        userPrincipal.getId());

    userService.setAlubRepo(userPrincipal.getId(), repoSetReq);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }

  @GetMapping("/repos/{repoName}")
  public ApiResponseDto<GithubRepoRes> getGithubRepo(@PathVariable String repoName,
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal) {
    log.info("GET /repos/{} - userId : {}", repoName, userPrincipal.getId());

    GithubRepoRes githubRepoRes = userService.getGithubRepo(userPrincipal.getId(), repoName);
    log.info("GET /repos/{} - userId : {}, response : {}", repoName, userPrincipal.getId(),
        githubRepoRes.toString());
    return ApiResponseDto.success(githubRepoRes);
  }

}
