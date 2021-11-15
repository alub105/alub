package com.a105.alub.common.exception;

public class FileNotFoundException extends RuntimeException {
  public FileNotFoundException() {
    super("존재하지 않는 파일입니다.");
  }
}
