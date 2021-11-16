package com.a105.alub.api.response;

import com.a105.alub.domain.entity.AssignedProblem;
import com.a105.alub.domain.entity.Study;
import com.a105.alub.domain.entity.StudyChannel;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
//@Builder
public class StudyDto {
  private final Long id;

  private final StudyChannel studyChannel;

  private final String name;

  private final LocalDateTime startTime;

  private final LocalDateTime endTime;

  private final LocalDateTime assignmentStartTime;

  private final LocalDateTime assignmentEndTime;

  private final List<AssignedProblemDto> assignedProblems;

  public StudyDto(Study study, List<AssignedProblemDto> assignedProblems) {
    this.id = study.getId();
    this.studyChannel = study.getStudyChannel();
    this.name = study.getName();
    this.startTime = study.getStartTime();
    this.endTime = study.getEndTime();
    this.assignmentStartTime = study.getAssignmentStartTime();
    this.assignmentEndTime = study.getAssignmentEndTime();
    this.assignedProblems = assignedProblems;
  }
}