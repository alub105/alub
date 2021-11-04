package com.a105.alub.common.exception;

public class UserNotFoundException extends RuntimeException {
  public UserNotFoundException() {
    super("존재하지 않는 user입니다.");
  }
}
