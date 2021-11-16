package com.a105.alub.api.advice;

import static com.a105.alub.common.response.ApiResponseCode.FAIL;

import com.a105.alub.api.controller.StudyController;
import com.a105.alub.common.response.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackageClasses = StudyController.class)
public class StudyControllerAdvice {

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponseDto<?> illegalArgumentExceptionHandler(IllegalArgumentException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

}
