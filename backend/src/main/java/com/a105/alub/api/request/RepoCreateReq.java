package com.a105.alub.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RepoCreateReq {
  @JsonProperty("name")
  private final String repoName;
}
