package com.a105.alub.api.response;

import com.a105.alub.domain.entity.AssignedProblem;
import com.a105.alub.domain.enums.ProblemLevel;
import com.a105.alub.domain.enums.Site;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Getter;

@Getter
public class AssignedProblemGetRes {

  private final Long id;

  private final Long num;

  private final String title;

  private final Site site;

  private final ProblemLevel level;

  @JsonProperty("members")
  private final List<SolvedGetRes> solvedList;

  public AssignedProblemGetRes(AssignedProblem assignedProblem,
      List<SolvedGetRes> solvedList) {
    this.id = assignedProblem.getId();
    this.num = assignedProblem.getNum();
    this.site = assignedProblem.getSite();
    this.title = assignedProblem.getTitle();
    this.level = assignedProblem.getProblemLevel();
    this.solvedList = solvedList;
  }
}
