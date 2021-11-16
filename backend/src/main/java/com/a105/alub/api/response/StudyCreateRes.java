package com.a105.alub.api.response;

import com.a105.alub.domain.entity.Study;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;

@Getter
public class StudyCreateRes {

  private final Long id;

  private final String name;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime startTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime endTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime assignmentStartTime;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
  private final LocalDateTime assignmentEndTime;

  private final List<AssignedProblemCreateRes> assignedProblems;

  public StudyCreateRes(Study study, List<AssignedProblemCreateRes> assignedProblems) {
    this.id = study.getId();
    this.name = study.getName();
    this.startTime = study.getStartTime();
    this.endTime = study.getEndTime();
    this.assignmentStartTime = study.getAssignmentStartTime();
    this.assignmentEndTime = study.getAssignmentEndTime();
    this.assignedProblems = assignedProblems;
  }
}