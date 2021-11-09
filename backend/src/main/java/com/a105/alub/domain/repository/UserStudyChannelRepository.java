package com.a105.alub.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.entity.UserStudyChannelId;

@Repository
public interface UserStudyChannelRepository
    extends JpaRepository<UserStudyChannel, UserStudyChannelId> {
}
