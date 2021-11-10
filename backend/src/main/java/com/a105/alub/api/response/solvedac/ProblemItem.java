package com.a105.alub.api.response.solvedac;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
public class ProblemItem {
  private long problemId;
  private String titleKo;
  private int level;
}
