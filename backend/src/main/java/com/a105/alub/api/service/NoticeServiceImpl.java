package com.a105.alub.api.service;

import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import com.a105.alub.api.request.NoticeCreateReq;
import com.a105.alub.api.request.NoticeModifyReq;
import com.a105.alub.api.response.GithubRepoContentRes;
import com.a105.alub.api.response.NoticeCreateRes;
import com.a105.alub.api.response.NoticeDto;
import com.a105.alub.api.response.NoticeRes;
import com.a105.alub.common.exception.NotHostException;
import com.a105.alub.common.exception.NotWriterException;
import com.a105.alub.common.exception.NoticeNotFoundException;
import com.a105.alub.common.exception.StudyChannelNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.exception.UserStudyChannelNotFoundException;
import com.a105.alub.domain.entity.Notice;
import com.a105.alub.domain.entity.StudyChannel;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.entity.UserStudyChannelId;
import com.a105.alub.domain.repository.NoticeRepository;
import com.a105.alub.domain.repository.StudyChannelRepository;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.domain.repository.UserStudyChannelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

  private final UserRepository userRepository;
  private final NoticeRepository noticeRepository;
  private final StudyChannelRepository studyChannelRepository;

  @Override
  public NoticeCreateRes createNotice(Long userId, Long channelId,
      NoticeCreateReq noticeCreateReq) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);

    checkException(userId, studyChannel);

    Notice notice = Notice.builder().title(noticeCreateReq.getTitle())
        .content(noticeCreateReq.getContent()).writerId(userId).studyChannel(studyChannel).build();

    Notice createdNotice = noticeRepository.save(notice);
    log.info("Create Notice: {}", notice);

    return new NoticeCreateRes(createdNotice.getId());
  }

  @Override
  public NoticeRes getNotice(Long channelId, Long noticeId) {
    Notice notice = noticeRepository.findById(noticeId).orElseThrow(NoticeNotFoundException::new);
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);

    checkException(studyChannel, notice);

    User writer =
        userRepository.findById(notice.getWriterId()).orElseThrow(UserNotFoundException::new);
    log.info("Get Notice: {}", studyChannel);

    NoticeRes noticeRes = NoticeRes.builder().title(notice.getTitle()).content(notice.getContent())
        .writer(writer.getName())
        .createdTime(
            notice.getCreatedDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss")))
        .build();
    return noticeRes;
  }

  @Override
  public void modifyNotice(Long userId, Long channelId, Long noticeId,
      NoticeModifyReq noticeModifyReq) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);
    Notice notice = noticeRepository.findById(noticeId).orElseThrow(NoticeNotFoundException::new);

    checkException(userId, studyChannel, notice);

    String content = noticeModifyReq.getContent();
    if (content != null) {
      notice.setContent(content);
    }
    String title = noticeModifyReq.getTitle();
    if (title != null) {
      notice.setTitle(title);
    }

    noticeRepository.save(notice);

    log.info("Update Notice ID: {}", noticeId);

  }

  @Override
  public void deleteNotice(Long userId, Long channelId, Long noticeId) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);
    Notice notice = noticeRepository.findById(noticeId).orElseThrow(NoticeNotFoundException::new);

    checkException(userId, studyChannel, notice);

    noticeRepository.deleteById(noticeId);

    log.info("Delete Notice ID: {}", noticeId);

  }

  @Override
  public List<NoticeDto> getNoticeList(Long channelId) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);

    checkException(studyChannel);

    List<Notice> noticeList = noticeRepository.findAllByStudyChannelId(channelId);
    List<NoticeDto> noticeDtoList = new LinkedList<NoticeDto>();
    noticeList.forEach(notice -> {
      noticeDtoList.add(new NoticeDto(notice));
    });
    return noticeDtoList;
  }

  private void checkException(StudyChannel studyChannel) {
    if (!isChannelEnabled(studyChannel)) {
      throw new StudyChannelNotFoundException();
    }
  }

  private void checkException(StudyChannel studyChannel, Notice notice) {
    if (!isChannelEnabled(studyChannel)) {
      throw new StudyChannelNotFoundException();
    }
    if (!isChannelNotice(studyChannel, notice)) {
      throw new NoticeNotFoundException();
    }
  }

  private void checkException(Long userId, StudyChannel studyChannel) {
    if (!isChannelEnabled(studyChannel)) {
      throw new StudyChannelNotFoundException();
    }
    if (!isHost(userId, studyChannel)) {
      throw new NotHostException();
    }
  }

  private void checkException(Long userId, StudyChannel studyChannel, Notice notice) {
    if (!isChannelEnabled(studyChannel)) {
      throw new StudyChannelNotFoundException();
    }
    if (!isChannelNotice(studyChannel, notice)) {
      throw new StudyChannelNotFoundException();
    }
    if (!isHost(userId, studyChannel)) {
      throw new NotHostException();
    }
    if (notice.getWriterId() != userId) {
      throw new NotWriterException();
    }
  }

  private boolean isChannelNotice(StudyChannel studyChannel, Notice notice) {
    if (studyChannel.getId() != notice.getStudyChannel().getId()) {
      return false;
    }
    return true;
  }

  private boolean isChannelEnabled(StudyChannel studyChannel) {
    if (!studyChannel.getEnabled()) {
      return false;
    }
    return true;
  }

  private boolean isHost(Long userId, StudyChannel studyChannel) {
    if (studyChannel.getHostId() != userId) {
      return false;
    }
    return true;
  }
}
