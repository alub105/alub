package com.a105.alub.api.response;

import com.a105.alub.domain.entity.Study;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudyGetSimpleRes {

  Long id;

  String name;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  LocalDateTime startTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  LocalDateTime endTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime assignmentStartTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime assignmentEndTime;

  public static StudyGetSimpleRes of(Study study) {
    return StudyGetSimpleRes.builder()
        .id(study.getId())
        .name(study.getName())
        .startTime(study.getStartTime())
        .endTime(study.getEndTime())
        .assignmentStartTime(study.getAssignmentStartTime())
        .assignmentEndTime(study.getAssignmentEndTime())
        .build();
  }
}
