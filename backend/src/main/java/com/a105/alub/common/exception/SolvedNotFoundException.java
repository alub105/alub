package com.a105.alub.common.exception;

public class SolvedNotFoundException extends RuntimeException {
  public SolvedNotFoundException() {
    super("존재하지 않는 Solved입니다.");
  }
}