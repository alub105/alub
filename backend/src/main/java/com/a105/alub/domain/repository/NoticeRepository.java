package com.a105.alub.domain.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.a105.alub.domain.entity.Notice;
import com.a105.alub.domain.entity.User;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
