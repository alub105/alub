package com.a105.alub.common.exception;

public class NotWriterException extends RuntimeException {
  public NotWriterException() {
    super("작성자가 아닙니다.");
  }
}
