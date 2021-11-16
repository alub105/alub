package com.a105.alub.domain.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Solved;
import com.a105.alub.domain.entity.SolvedId;

@Repository
public interface SolvedRepository extends JpaRepository<Solved, SolvedId> {
  Optional<Solved> findByUser_IdAndAssignedProblem_Id(Long userId, Long assignedProblemId);
}
