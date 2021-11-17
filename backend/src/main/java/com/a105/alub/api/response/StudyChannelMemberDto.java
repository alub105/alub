package com.a105.alub.api.response;

import com.a105.alub.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudyChannelMemberDto {
  Long id;
  String email;
  String name;
  String repoName;
  String dirPath;

  public StudyChannelMemberDto(User user) {
    this.id = user.getId();
    this.name = user.getName();
    this.email = user.getEmail();
    this.repoName = user.getRepoName();
    this.dirPath = user.getDirPath();
  }
}
