package com.a105.alub.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class LoginRes {
  
  private Long userId;
  private String name;
  private String email;
  private String token;
  private String imageUrl;
  
}
