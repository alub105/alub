package com.a105.alub.domain.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
  List<Notice> findAllByStudyChannelId(Long id);
}
