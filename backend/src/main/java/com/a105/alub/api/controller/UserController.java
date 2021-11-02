package com.a105.alub.api.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.service.UserService;
import com.a105.alub.common.response.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/api/user")
@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  
  @PostMapping("/authenticate")
  public ApiResponseDto<LoginRes> login(@RequestBody LoginReq loginReq){
    
    LoginRes loginResponse = userService.login(loginReq);
    log.info("Login Response: {}", loginResponse);
    
    return ApiResponseDto.success(loginResponse);
  }
  
}
