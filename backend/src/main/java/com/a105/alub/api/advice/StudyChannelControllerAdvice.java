package com.a105.alub.api.advice;


import static com.a105.alub.common.response.ApiResponseCode.FAIL;

import com.a105.alub.api.controller.StudyChannelController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.a105.alub.common.exception.NotHostException;
import com.a105.alub.common.exception.StudyChannelNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.exception.UserStudyChannelNotFoundException;
import com.a105.alub.common.response.ApiResponseDto;

@RestControllerAdvice(basePackageClasses = StudyChannelController.class)
public class StudyChannelControllerAdvice {

  @ExceptionHandler(StudyChannelNotFoundException.class)
  public ApiResponseDto<?> channelNotFoundExceptionHandler(StudyChannelNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(UserStudyChannelNotFoundException.class)
  public ApiResponseDto<?> userStudyChannelNotFoundExceptionHandler(
      UserStudyChannelNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(NotHostException.class)
  public ApiResponseDto<?> NotHostExceptionHandler(NotHostException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

}
