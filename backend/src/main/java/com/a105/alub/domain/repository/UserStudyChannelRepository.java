package com.a105.alub.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.entity.UserStudyChannelId;

@Repository
public interface UserStudyChannelRepository
    extends JpaRepository<UserStudyChannel, UserStudyChannelId> {

  Optional<UserStudyChannel> findByUserStudyChannelIdAndEnabledIsTrue(UserStudyChannelId userStudyChannelId);

  List<UserStudyChannel> findAllByStudyChannelIdAndEnabledIsTrue(Long studyChannelId);

  List<UserStudyChannel> findAllByUserIdAndEnabledIsTrue(Long userId);

}
