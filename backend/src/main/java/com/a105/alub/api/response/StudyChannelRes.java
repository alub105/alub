package com.a105.alub.api.response;

import java.util.LinkedList;
import java.util.List;
import com.a105.alub.domain.entity.StudyChannel;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.entity.UserStudyChannel;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class StudyChannelRes {
  String name;
  StudyChannelUserDto host;
  List<StudyChannelUserDto> member;

  public StudyChannelRes(StudyChannel studyChannel, User host,
      List<UserStudyChannel> userStudyChannelList) {

    this.name = studyChannel.getName();
    this.host = new StudyChannelUserDto(host);

    List<StudyChannelUserDto> userList = new LinkedList<StudyChannelUserDto>();
    userStudyChannelList.stream().forEach(userStudyChannel -> {
      if (userStudyChannel.getUserStudyChannelId().getUserId() != studyChannel.getHostId()) {
        userList.add(new StudyChannelUserDto(userStudyChannel.getUser()));
      }
    });
    this.member = userList;
  }
}
