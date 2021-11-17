package com.a105.alub.domain.repository;

import com.a105.alub.domain.entity.Study;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {

  List<Study> findByStudyChannel_Id(Long studyChannelId);
}
