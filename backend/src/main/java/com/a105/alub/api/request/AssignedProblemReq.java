package com.a105.alub.api.request;

import com.a105.alub.domain.enums.ProblemLevelDeserializer;
import com.a105.alub.domain.enums.ProblemLevel;
import com.a105.alub.domain.enums.Site;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class AssignedProblemReq {
  private Long num;
  private String title;
  private Site site;

  @JsonDeserialize(using = ProblemLevelDeserializer.class)
  private ProblemLevel level;
}
