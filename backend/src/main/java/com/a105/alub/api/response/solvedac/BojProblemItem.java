package com.a105.alub.api.response.solvedac;

import com.a105.alub.domain.enums.BojLevel;
import com.a105.alub.domain.enums.ProblemLevel;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
public class BojProblemItem {
  @JsonProperty("problemId")
  private long num;

  @JsonProperty("titleKo")
  private String title;

  private BojLevel level;
}
