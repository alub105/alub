package com.a105.alub.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Study;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {
}
