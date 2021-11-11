package com.a105.alub.api.response;

import java.util.LinkedList;
import java.util.List;
import com.a105.alub.domain.entity.UserStudyChannel;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class StudyChannelListRes {
  List<StudyChannelDto> channel;

  public StudyChannelListRes(List<UserStudyChannel> userStudyChannelList) {
    List<StudyChannelDto> channelList = new LinkedList<StudyChannelDto>();
    userStudyChannelList.stream().forEach(userStudyChannel -> {
      channelList.add(new StudyChannelDto(userStudyChannel.getStudyChannel()));
    });

    this.channel = channelList;
  }
}
