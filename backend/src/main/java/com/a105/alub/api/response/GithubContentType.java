package com.a105.alub.api.response;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GithubContentType {
  FILE("file"),
  DIR("dir"),
  SYMLINK("symlink"),
  SUBMODULE("submodule");

  private final String message;

  @JsonValue
  public String toJson() {
    return this.getMessage();
  }
}
