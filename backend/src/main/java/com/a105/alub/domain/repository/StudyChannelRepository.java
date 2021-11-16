package com.a105.alub.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.StudyChannel;

@Repository
public interface StudyChannelRepository extends JpaRepository<StudyChannel, Long> {
}
