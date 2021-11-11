package com.a105.alub.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.BAD_REQUEST, reason="Timer format is wrong")
public class TimerFormatException extends RuntimeException {
  public TimerFormatException(String message) {
    super(message);
  }
}
