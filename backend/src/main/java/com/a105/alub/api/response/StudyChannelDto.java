package com.a105.alub.api.response;

import com.a105.alub.domain.entity.StudyChannel;
import com.a105.alub.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudyChannelDto {
  Long id;
  String name;

  public StudyChannelDto(StudyChannel studyChannel) {
    this.id = studyChannel.getId();
    this.name = studyChannel.getName();
  }
}
