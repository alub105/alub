package com.a105.alub.api.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.a105.alub.api.request.ProblemTerms;
import com.a105.alub.api.response.ProblemRes;
import com.a105.alub.api.response.solvedac.BojProblemItem;
import com.a105.alub.api.response.solvedac.SolvedacSearchRes;
import com.a105.alub.domain.entity.Problem;
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
  public List<ProblemRes> searchProblems(ProblemTerms terms) {
    List<ProblemRes> problemResList = new ArrayList<>();

    Site site = terms.getSite();
    if (site == Site.BOJ) {
      SolvedacSearchRes solvedacSearchRes = getBojSearch(terms.getKeyword());
      for (BojProblemItem item : solvedacSearchRes.getItems()) {
        problemResList.add(new ProblemRes(item, site));
      }
    } else if (site == Site.PROGRAMMERS) {
      for (Problem problem : getProgrammersSearch(terms.getKeyword())) {
        problemResList.add(new ProblemRes(problem, site));
      }
    }
    log.info("search problems on {} : {}", site.name(), problemResList.toArray());

    return problemResList;
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
