package com.a105.alub.domain.entity;

import com.a105.alub.api.request.StudyCreateReq;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Study extends BaseTimeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "study_channel_id")
  private StudyChannel studyChannel;

  private String name;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  private LocalDateTime assignmentStartTime;

  private LocalDateTime assignmentEndTime;

  public Study(StudyCreateReq studyCreateReq, StudyChannel studyChannel) {
    this.name = studyCreateReq.getName();
    this.startTime = studyCreateReq.getStartTime();
    this.endTime = studyCreateReq.getEndTime();
    this.assignmentStartTime = studyCreateReq.getAssignmentStartTime();
    this.assignmentEndTime = studyCreateReq.getAssignmentEndTime();
    this.studyChannel = studyChannel;
  }
}
