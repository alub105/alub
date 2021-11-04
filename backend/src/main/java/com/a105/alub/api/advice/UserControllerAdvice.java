package com.a105.alub.api.advice;


import static com.a105.alub.common.response.ApiResponseCode.FAIL;

import com.a105.alub.common.exception.AlreadyExistingRepoException;
import com.a105.alub.common.exception.RepoNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.response.ApiResponseDto;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UserControllerAdvice {

  @ExceptionHandler(IllegalStateException.class)
  public ApiResponseDto<?> illegalStateExceptionHandler(IllegalStateException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(AlreadyExistingRepoException.class)
  public ApiResponseDto<?> alreadyExistingRepoExceptionHandler(AlreadyExistingRepoException e) {
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
}
