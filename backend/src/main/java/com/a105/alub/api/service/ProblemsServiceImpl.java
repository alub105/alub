package com.a105.alub.api.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.a105.alub.api.request.ProblemTerms;
import com.a105.alub.api.response.ProblemsRes;
import com.a105.alub.api.response.solvedac.ProblemItem;
import com.a105.alub.api.response.solvedac.SolvedacSearchRes;
import com.a105.alub.domain.entity.Problem;
import com.a105.alub.domain.enums.BojLevel;
import com.a105.alub.domain.enums.Site;
import com.a105.alub.domain.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemsServiceImpl implements ProblemsService {

  private final ProblemRepository problemRepository;
  private final WebClient solvedacApiClient;

  @Override
  public List<ProblemsRes> searchProblems(ProblemTerms terms) {
    List<ProblemsRes> problemsResList = new ArrayList<ProblemsRes>();
    Site site = terms.getSite();

    if (site == Site.BOJ) {
      SolvedacSearchRes solvedacSearchRes = getBojSearch(terms.getKeyword());
      log.info("search problems on BOJ: {}", solvedacSearchRes);
      for (ProblemItem item : solvedacSearchRes.getItems()) {
        problemsResList.add(ProblemsRes.builder().num(item.getProblemId()).title(item.getTitleKo())
            .site(site).level(BojLevel.values()[item.getLevel()].toString()).build());
      }
    } else if (site == Site.PROGRAMMERS) {
      List<Problem> problemList = getProgrammersSearch(terms.getKeyword());
      for (Problem problem : problemList) {
        problemsResList.add(
            ProblemsRes.builder().num(problem.getProblemId().getNum()).title(problem.getTitle())
                .site(problem.getProblemId().getSite()).level(problem.getLevel()).build()
        );
      }
    }
    
    return problemsResList;
  }

  private SolvedacSearchRes getBojSearch(String keyword) {
    return solvedacApiClient.get().uri("/search/problem?query={keyword}", keyword).retrieve()
        .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
            clientResponse -> clientResponse.bodyToMono(String.class)
                .map(body -> new RuntimeException(body)))
        .bodyToMono(SolvedacSearchRes.class).block();
  }

  private List<Problem> getProgrammersSearch(String keyword) {
    return problemRepository.findByTitleContaining(keyword);
  }
}
