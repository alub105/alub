package com.a105.alub.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GithubTokenRes {
  @JsonProperty("access_token")
  private String accessToken;
  private String scope;
  @JsonProperty("token_type")
  private String tokenType;
}
