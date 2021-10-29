package com.a105.alub.api.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginRes {
  
  private Long userId;
  private String name;
  private String email;
  private String token;
  private String imgeUrl;
  
}
