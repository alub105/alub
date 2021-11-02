package com.a105.alub.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// JPA Entity 클래스들이 해당 추상 클래스를 상속할 경우 createDate, modifiedDate를 column으로 인식
@MappedSuperclass
@Getter
@EntityListeners(AuditingEntityListener.class) // 해당 클래스에 Auditing 기능을 포함
public abstract class BaseTimeEntity {

    @CreatedDate // Entity가 생성되어 저장될 때 시간이 자동 저장
    private LocalDateTime createdDate;

    @LastModifiedDate // Entity가 생성되어 저장될 때 시간이 자동 저장
    private LocalDateTime modifiedDate;

}
