package com.a105.alub.api.service;

import java.util.List;
import com.a105.alub.api.request.ProblemTerms;
import com.a105.alub.api.response.ProblemRes;

public interface ProblemsService {

  List<ProblemRes> searchProblems(ProblemTerms terms);
}
