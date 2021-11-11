package com.a105.alub.common.exception;

public class NotHostException extends RuntimeException {
  public NotHostException() {
    super("채널의 Host가 아닙니다.");
  }
}
