package com.a105.alub.common.exception;

public class DirSettingFailException extends RuntimeException {
  public DirSettingFailException() {
    super("해당 directory 이름으로 설정할 수 없습니다.");
  }
}
