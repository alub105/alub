package com.a105.alub.api.advice;


import static com.a105.alub.common.response.ApiResponseCode.FAIL;

import com.a105.alub.common.exception.AlreadyExistingRepoException;
import com.a105.alub.common.exception.DirSettingFailException;
import com.a105.alub.common.exception.ProblemNotFoundException;
import com.a105.alub.common.exception.RepoNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.response.ApiResponseDto;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ProblemsControllerAdvice {

  @ExceptionHandler(ProblemNotFoundException.class)
  public ApiResponseDto<?> problemNotFoundExceptionHandler(ProblemNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

}
