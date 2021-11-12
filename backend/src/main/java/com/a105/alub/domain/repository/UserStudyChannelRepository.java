package com.a105.alub.domain.repository;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.entity.UserStudyChannelId;

@Repository
public interface UserStudyChannelRepository
    extends JpaRepository<UserStudyChannel, UserStudyChannelId> {
  List<UserStudyChannel> findAllByStudyChannelId(Long studyChannelId);

  @Transactional
  void deleteAllByStudyChannelId(Long studyChannelId);

  List<UserStudyChannel> findAllByUserId(Long userId);
}
