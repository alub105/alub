package com.a105.alub.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GithubUserRes {
  
  private Long id;
  private String login;
  private String email;
  @JsonProperty("avatar_url")
  private String avatarUrl;
  
}
