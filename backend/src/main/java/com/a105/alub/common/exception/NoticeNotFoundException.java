package com.a105.alub.common.exception;

public class NoticeNotFoundException extends RuntimeException {
  public NoticeNotFoundException() {
    super("존재하지 않는 notice입니다.");
  }
}
