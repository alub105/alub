package com.a105.alub.common.exception;

public class ProblemNotFoundException extends RuntimeException {
  public ProblemNotFoundException() {
    super("해당 검색에 대한 문제가 존재하지 않습니다.");
  }
}
