package com.a105.alub.api.service;

import java.util.List;
import com.a105.alub.api.request.ProblemTerms;
import com.a105.alub.api.response.ProblemsRes;

public interface ProblemsService {

  List<ProblemsRes> searchProblems(ProblemTerms terms);
}
