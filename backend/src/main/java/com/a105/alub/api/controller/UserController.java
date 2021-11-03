package com.a105.alub.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.UserInfoRes;
import com.a105.alub.api.service.UserService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.security.CurrentUser;
import com.a105.alub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Slf4j
@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/")
  public ApiResponseDto<UserInfoRes> getInfo(@ApiIgnore @CurrentUser UserPrincipal userPrincipal) {
    UserInfoRes userInfoRes = userService.getUserInfo(userPrincipal.getName());
    log.info("Get User Info: {}", userInfoRes);

    return ApiResponseDto.success(userInfoRes);
  }

  @PostMapping("/authenticate")
  public ApiResponseDto<LoginRes> login(@RequestBody LoginReq loginReq) {

    LoginRes loginResponse = userService.login(loginReq);
    log.info("Login Response: {}", loginResponse);

    return ApiResponseDto.success(loginResponse);
  }

}
