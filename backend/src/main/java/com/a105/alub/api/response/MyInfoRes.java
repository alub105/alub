package com.a105.alub.api.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyInfoRes {

  private Long userId;
  private String email;
  private String name;
  private String imageUrl;

}
