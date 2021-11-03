package com.a105.alub.common.exception;

public class AlreadyExistingRepoException extends RuntimeException {
  public AlreadyExistingRepoException() {
    super("이미 존재하는 repository입니다.");
  }
}
