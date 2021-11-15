package com.a105.alub.common.exception;

public class TokenForbiddenException extends RuntimeException {
  public TokenForbiddenException() {
    super("토큰으로 접근이 불가능합니다");
  }
}
