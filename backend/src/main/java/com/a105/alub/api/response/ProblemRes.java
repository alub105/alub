package com.a105.alub.api.response;

import com.a105.alub.api.response.solvedac.BojProblemItem;
import com.a105.alub.domain.entity.Problem;
import com.a105.alub.domain.enums.ProblemLevel;
import com.a105.alub.domain.enums.Site;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ProblemRes {

  private final Long num;
  private final String title;
  private final Site site;
  private final ProblemLevel level;

  public ProblemRes(BojProblemItem bojProblemItem, Site site) {
    this.num = bojProblemItem.getNum();
    this.title = bojProblemItem.getTitle();
    this.level = bojProblemItem.getLevel();
    this.site = site;
  }

  public ProblemRes(Problem problem, Site site) {
    this.num = problem.getProblemId().getNum();
    this.title = problem.getTitle();
    this.level = problem.getProblemLevel();
    this.site = site;
  }

}
