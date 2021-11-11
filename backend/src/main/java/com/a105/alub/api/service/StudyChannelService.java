package com.a105.alub.api.service;

import com.a105.alub.api.request.StudyChannelCreateReq;
import com.a105.alub.api.request.StudyChannelModifyReq;
import com.a105.alub.api.response.StudyChannelListRes;
import com.a105.alub.api.response.StudyChannelRes;

public interface StudyChannelService {
  void createChannel(Long userId, StudyChannelCreateReq channelCreateReq);

  StudyChannelRes getChannel(Long channelId);

  void modifyChannel(Long userId, Long channelId, StudyChannelModifyReq channelModifyReq);

  void deleteChannel(Long userId, Long channelId);

  StudyChannelListRes getChannelList(Long userId);
}
