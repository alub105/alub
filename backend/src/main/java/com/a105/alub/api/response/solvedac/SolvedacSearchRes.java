package com.a105.alub.api.response.solvedac;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class SolvedacSearchRes {
  private long count;
  private List<ProblemItem> items; 
}
