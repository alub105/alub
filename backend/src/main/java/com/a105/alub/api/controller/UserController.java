package com.a105.alub.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.MyInfoRes;
import com.a105.alub.api.service.UserService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.security.CurrentUser;
import com.a105.alub.security.UserPrincipal;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
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
  public ApiResponseDto<MyInfoRes> getMyInfo(@ApiIgnore @CurrentUser UserPrincipal userPrincipal) {
    MyInfoRes userInfoRes = userService.getMyInfo(userPrincipal.getId());
    log.info("Get User Info: {}", userInfoRes);

    return ApiResponseDto.success(userInfoRes);
  }

  @ApiOperation(value = "github authenticate", notes = "github 사용자 인증을 합니다.",
      response = ApiResponseDto.class)
  @ApiResponses({@ApiResponse(code = 200, message = "성공"),
      @ApiResponse(code = 401, message = "인증 실패"), @ApiResponse(code = 404, message = "페이지 없음"),
      @ApiResponse(code = 500, message = "서버 오류")})
  @PostMapping("/authenticate")
  public ApiResponseDto<LoginRes> login(@RequestBody LoginReq loginReq) {

    LoginRes loginResponse = userService.login(loginReq);
    log.info("Login Response: {}", loginResponse);

    return ApiResponseDto.success(loginResponse);
  }

  @ApiOperation(value = "사용자 설정 정보", notes = "인증된 사용자의 설정 정보를 반환합니다.",
      response = ApiResponseDto.class)
  @ApiResponses({@ApiResponse(code = 200, message = "성공"),
      @ApiResponse(code = 401, message = "인증 실패"), @ApiResponse(code = 403, message = "인가 실패"),
      @ApiResponse(code = 500, message = "서버 오류")})
  @GetMapping("/configs")
  public ApiResponseDto<ConfigsRes> getConfigs(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal) {

    ConfigsRes configsRes = userService.getConfigs(userPrincipal.getId());
    log.info("Get User Configuration: {}", configsRes);

    return ApiResponseDto.success(configsRes);
  }

  @ApiOperation(value = "사용자 commit, timer 설정", notes = "인증된 사용자의 commit, timer 설정합니다.",
      response = ApiResponseDto.class)
  @ApiResponses({@ApiResponse(code = 200, message = "성공"),
      @ApiResponse(code = 401, message = "인증 실패"), @ApiResponse(code = 403, message = "인가 실패"),
      @ApiResponse(code = 500, message = "서버 오류")})
  @PatchMapping("/configs")
  public ApiResponseDto<String> updateConfigs(@ApiIgnore @CurrentUser UserPrincipal userPrincipal,
      @RequestBody ConfigsReq configsReq) {

    userService.updateConfigs(userPrincipal.getId(), configsReq);
    log.info("Success setting user configs");

    return ApiResponseDto.DEFAULT_SUCCESS;
  }
}
