package com.a105.alub.api.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.a105.alub.api.request.StudyChannelCreateReq;
import com.a105.alub.api.request.StudyChannelModifyReq;
import com.a105.alub.api.response.StudyChannelListRes;
import com.a105.alub.api.response.StudyChannelRes;
import com.a105.alub.common.exception.StudyChannelNotFoundException;
import com.a105.alub.common.exception.UserNotFoundException;
import com.a105.alub.common.exception.UserStudyChannelNotFoundException;
import com.a105.alub.domain.entity.StudyChannel;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.entity.UserStudyChannelId;
import com.a105.alub.domain.repository.StudyChannelRepository;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.domain.repository.UserStudyChannelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyChannelServiceImpl implements StudyChannelService {

  private final UserRepository userRepository;
  private final StudyChannelRepository studyChannelRepository;
  private final UserStudyChannelRepository userStudyChannelRepository;

  @Override
  public void createChannel(Long userId, StudyChannelCreateReq channelCreateReq) {
    StudyChannel studyChannel = StudyChannel.builder().name(channelCreateReq.getName())
        .hostId(userId).enabled(true).build();
    StudyChannel createdStudyChannel = studyChannelRepository.save(studyChannel);

    log.info("Created Study Channel: {}", createdStudyChannel);

    createUserStudyChannel(createdStudyChannel, channelCreateReq.getMemberId());;

    log.info("Created All User Study Channel");

  }

  @Override
  public StudyChannelRes getChannel(Long userId, Long channelId) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);
    User host =
        userRepository.findById(studyChannel.getHostId()).orElseThrow(UserNotFoundException::new);
    List<UserStudyChannel> userStudyChannelList =
        userStudyChannelRepository.findAllByStudyChannelId(channelId);

    log.info("Get Study Channel: {}", studyChannel);

    StudyChannelRes channelRes = new StudyChannelRes(studyChannel, host, userStudyChannelList);
    return channelRes;
  }

  @Override
  public void modifyChannel(Long userId, Long channelId, StudyChannelModifyReq channelModifyReq) {
    if (!isHost(userId, channelId)) {
      throw new RuntimeException();
    }

    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);
    studyChannel.setHostId(channelModifyReq.getHostId());
    studyChannel.setName(channelModifyReq.getName());
    studyChannelRepository.save(studyChannel);

    log.info("Updated Study Channel ID: {}", channelId);

    createUserStudyChannel(studyChannel, channelModifyReq.getAddedMember());
    deleteUserStudyChannel(studyChannel, channelModifyReq.getDeletedMember());

    log.info("Updated Study Channel ID: {}", channelId);

  }

  @Override
  public void deleteChannel(Long userId, Long channelId) {
    if (!isHost(userId, channelId)) {

    }

    userStudyChannelRepository.deleteAllByStudyChannelId(channelId);

    log.info("Deleted All User Study Channel ID: {}", channelId);

    studyChannelRepository.deleteById(channelId);

    log.info("Deleted Study Channel ID: {}", channelId);
  }

  @Override
  public StudyChannelListRes getChannelList(Long userId) {
    List<UserStudyChannel> userStudyChannelList =
        userStudyChannelRepository.findAllByUserId(userId);
    StudyChannelListRes channelListRes = new StudyChannelListRes(userStudyChannelList);

    return channelListRes;
  }

  private boolean isHost(Long userId, Long channelId) {
    StudyChannel studyChannel =
        studyChannelRepository.findById(channelId).orElseThrow(StudyChannelNotFoundException::new);
    if (studyChannel.getHostId() != userId) {
      return false;
    }
    return true;
  }

  private void createUserStudyChannel(StudyChannel createdStudyChannel, List<Long> memberList) {

    memberList.stream().forEach(userId -> {
      UserStudyChannelId userStudyChannelId =
          new UserStudyChannelId(userId, createdStudyChannel.getId());

      UserStudyChannel userStudyChannel = UserStudyChannel.builder()
          .userStudyChannelId(userStudyChannelId).studyChannel(createdStudyChannel)
          .user(userRepository.findById(userId).orElseThrow(UserNotFoundException::new))
          .enabled(true).build();

      userStudyChannelRepository.save(userStudyChannel);
    });

  }

  // private void updateUserStudyChannel(StudyChannel createdStudyChannel, List<Long> memberList) {
  //
  // memberList.stream().forEach(userId -> {
  // UserStudyChannelId userStudyChannelId =
  // new UserStudyChannelId(userId, createdStudyChannel.getId());
  //
  // UserStudyChannel userStudyChannel = userStudyChannelRepository.findById(userStudyChannelId)
  // .orElseThrow(UserStudyChannelNotFoundException::new);
  //
  // userStudyChannelRepository.save(userStudyChannel);
  // });
  //
  // }

  private void deleteUserStudyChannel(StudyChannel createdStudyChannel, List<Long> memberList) {

    memberList.stream().forEach(userId -> {
      UserStudyChannelId userStudyChannelId =
          new UserStudyChannelId(userId, createdStudyChannel.getId());

      userStudyChannelRepository.deleteById(userStudyChannelId);
    });

  }
}
