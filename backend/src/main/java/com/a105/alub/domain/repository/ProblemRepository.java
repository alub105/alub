package com.a105.alub.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Problem;
import com.a105.alub.domain.entity.ProblemId;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, ProblemId> {

  List<Problem> findByTitleContaining(String keyword);
}
