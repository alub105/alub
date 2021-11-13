package com.a105.alub.common.exception;

public class StudyChannelNotFoundException extends RuntimeException {
  public StudyChannelNotFoundException() {
    super("존재하지 않는 channel입니다.");
  }
}
