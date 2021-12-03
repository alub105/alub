package com.a105.alub.api.service;

import java.util.List;
import com.a105.alub.api.request.NoticeCreateReq;
import com.a105.alub.api.request.NoticeModifyReq;
import com.a105.alub.api.response.NoticeCreateRes;
import com.a105.alub.api.response.NoticeDto;
import com.a105.alub.api.response.NoticeRes;

public interface NoticeService {

  NoticeCreateRes createNotice(Long userId, Long channelId, NoticeCreateReq noticeCreateReq);

  NoticeRes getNotice(Long channelId, Long noticeId);

  void modifyNotice(Long userId, Long channelId, Long noticeId, NoticeModifyReq noticeModifyReq);

  void deleteNotice(Long userId, Long channelId, Long noticeId);

  List<NoticeDto> getNoticeList(Long channelId);
}
