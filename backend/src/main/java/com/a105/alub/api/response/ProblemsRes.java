package com.a105.alub.api.response;

import com.a105.alub.domain.enums.Site;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class ProblemsRes {

  private Long num;
  private String title;
  private Site site;
  private String level;

}
