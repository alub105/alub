package com.a105.alub.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Solved;
import com.a105.alub.domain.entity.SolvedId;

@Repository
public interface SolvedRepository extends JpaRepository<Solved, SolvedId> {
}
