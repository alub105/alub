package com.a105.alub.common.exception;

public class UserStudyChannelNotFoundException extends RuntimeException {
  public UserStudyChannelNotFoundException() {
    super("채널에 존재하지 않는 user입니다.");
  }
}
