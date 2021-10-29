package com.a105.alub.api.request;

import com.a105.alub.domain.enums.Platform;
import lombok.Getter;

@Getter
public class LoginReq {
  private String code;
  private Platform plateform;
}
