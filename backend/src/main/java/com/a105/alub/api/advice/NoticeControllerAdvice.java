package com.a105.alub.api.advice;


import static com.a105.alub.common.response.ApiResponseCode.FAIL;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.a105.alub.api.controller.NoticeController;
import com.a105.alub.common.exception.NotWriterException;
import com.a105.alub.common.exception.NoticeNotFoundException;
import com.a105.alub.common.response.ApiResponseDto;

@RestControllerAdvice(basePackageClasses = NoticeController.class)
public class NoticeControllerAdvice {

  @ExceptionHandler(NoticeNotFoundException.class)
  public ApiResponseDto<?> noticeNotFoundException(NoticeNotFoundException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

  @ExceptionHandler(NotWriterException.class)
  public ApiResponseDto<?> notWriterException(NotWriterException e) {
    return new ApiResponseDto<>(FAIL, e.getMessage());
  }

}
