package com.a105.alub.api.controller;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.ProblemsReq;
import com.a105.alub.api.response.ProblemRes;
import com.a105.alub.api.service.ProblemsService;
import com.a105.alub.common.response.ApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/api/problems")
@RestController
@RequiredArgsConstructor
public class ProblemsController {

  private final ProblemsService problemsService;

  @PostMapping("/searches")
  public ApiResponseDto<List<ProblemRes>> searchProblems(@RequestBody ProblemsReq problemsReq) {

    List<ProblemRes> problemResList = problemsService.searchProblems(problemsReq.getTerms());
    log.info("Search for problems with '{}': {}", problemsReq.getTerms().getKeyword(),
        problemResList);

    return ApiResponseDto.success(problemResList);
  }
}
