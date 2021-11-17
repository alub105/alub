package com.a105.alub.api.response;

import com.a105.alub.domain.entity.AssignedProblem;
import com.a105.alub.domain.enums.ProblemLevel;
import com.a105.alub.domain.enums.Site;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AssignedProblemCreateRes {

  private final Long id;

  private final Long num;

  private final String title;

  private final Site site;

  private final ProblemLevel level;

  public static AssignedProblemCreateRes of(AssignedProblem assignedProblem) {
    return new AssignedProblemCreateResBuilder()
        .id(assignedProblem.getId())
        .num(assignedProblem.getNum())
        .title(assignedProblem.getTitle())
        .site(assignedProblem.getSite())
        .level(assignedProblem.getProblemLevel())
        .build();
  }
}
