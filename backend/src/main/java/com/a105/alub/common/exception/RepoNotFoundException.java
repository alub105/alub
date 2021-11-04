package com.a105.alub.common.exception;

public class RepoNotFoundException extends RuntimeException {
  public RepoNotFoundException() {
    super("존재하지 않는 repository입니다.");
  }
}
