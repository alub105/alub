package com.a105.alub.api.request;

import com.a105.alub.domain.enums.Site;
import lombok.Getter;

@Getter
public class ProblemTerms {
  private Site site;
  private String keyword;
}
