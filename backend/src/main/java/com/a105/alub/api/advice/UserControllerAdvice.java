package com.a105.alub.api.advice;


import static com.a105.alub.common.response.ApiResponseCode.FAIL;

import com.a105.alub.api.controller.UserController;
import com.a105.alub.api.controller.UsersController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.a105.alub.common.exception.AlreadyExistingRepoException;
import com.a105.alub.common.exception.DirSettingFailException;
import com.a105.alub.common.exception.FileNotFoundException;
import com.a105.alub.common.exception.RepoNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.exception.WrongRepoParamException;
import com.a105.alub.common.response.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestControllerAdvice(basePackageClasses = {UserController.class, UsersController.class})
public class UserControllerAdvice {

  @ExceptionHandler(IllegalStateException.class)
  public ApiResponseDto<?> illegalStateExceptionHandler(IllegalStateException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ApiResponseDto<?> illegalArgumentExceptionHandler(IllegalArgumentException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(AlreadyExistingRepoException.class)
  public ApiResponseDto<?> alreadyExistingRepoExceptionHandler(AlreadyExistingRepoException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(DirSettingFailException.class)
  public ApiResponseDto<?> dirSettingFailExceptionHandler(DirSettingFailException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(RepoNotFoundException.class)
  public ApiResponseDto<?> repoNotFoundExceptionHandler(RepoNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ApiResponseDto<?> userNotFoundExceptionHandler(UserNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(FileNotFoundException.class)
  public ApiResponseDto<?> fileNotFoundExceptionHandler(FileNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(WrongRepoParamException.class)
  public ResponseEntity<?> wrongRepoParamExceptionHandler(WrongRepoParamException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiResponseDto<>(FAIL, e.getMessage()));
  }

}
