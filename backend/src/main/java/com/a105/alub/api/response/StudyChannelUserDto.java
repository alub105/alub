package com.a105.alub.api.response;

import com.a105.alub.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudyChannelUserDto {
  Long id;
  String name;

  public StudyChannelUserDto(User user) {
    this.id = user.getId();
    this.name = user.getName();
  }
}
