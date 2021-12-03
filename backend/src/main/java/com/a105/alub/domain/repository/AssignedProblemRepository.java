package com.a105.alub.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.AssignedProblem;

@Repository
public interface AssignedProblemRepository extends JpaRepository<AssignedProblem, Long> {
  List<AssignedProblem> findByStudyId(Long studyId);
}
