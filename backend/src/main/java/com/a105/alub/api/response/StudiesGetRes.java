package com.a105.alub.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Getter;

@Getter
public class StudiesGetRes {

  @JsonProperty("running")
  List<StudyGetSimpleRes> runningStudies;

  @JsonProperty("ended")
  List<StudyGetSimpleRes> endedStudies;

  public StudiesGetRes(List<StudyGetSimpleRes> runningStudies, List<StudyGetSimpleRes> endedStudies) {
    this.runningStudies = runningStudies;
    this.endedStudies = endedStudies;
  }
}
