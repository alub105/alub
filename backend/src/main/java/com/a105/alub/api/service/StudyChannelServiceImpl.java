package com.a105.alub.api.service;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.a105.alub.api.request.StudyChannelCreateReq;
import com.a105.alub.api.request.StudyChannelModifyReq;
import com.a105.alub.api.response.StudyChannelCreateRes;
import com.a105.alub.api.response.StudyChannelListRes;
import com.a105.alub.api.response.StudyChannelMemberDto;
import com.a105.alub.api.response.StudyChannelRes;
import com.a105.alub.common.exception.NotHostException;
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
  @Transactional
  public StudyChannelCreateRes createChannel(Long userId, StudyChannelCreateReq channelCreateReq) {

    isUser(channelCreateReq.getMemberId());

    StudyChannel studyChannel = StudyChannel.builder().name(channelCreateReq.getName())
        .hostId(userId).enabled(true).build();
    StudyChannel createdStudyChannel = studyChannelRepository.save(studyChannel);

    log.info("Created Study Channel: {}", createdStudyChannel);

    createUserStudyChannel(createdStudyChannel, channelCreateReq.getMemberId());;

    log.info("Created All User Study Channel");

    return new StudyChannelCreateRes(studyChannel.getId());
  }

  @Override
  public StudyChannelRes getChannel(Long studyChannelId) {
    StudyChannel studyChannel = studyChannelRepository.findById(studyChannelId)
        .orElseThrow(StudyChannelNotFoundException::new);
    if (!studyChannel.getEnabled()) {
      throw new StudyChannelNotFoundException();
    }
    User host =
        userRepository.findById(studyChannel.getHostId()).orElseThrow(UserNotFoundException::new);
    List<UserStudyChannel> userStudyChannelList =
        userStudyChannelRepository.findAllByStudyChannelId(studyChannelId);
    userStudyChannelList = userStudyChannelList.stream().filter(UserStudyChannel::isEnabled)
        .collect(Collectors.toList());

    log.info("Get Study Channel: {}", studyChannel);

    StudyChannelRes channelRes = new StudyChannelRes(studyChannel, host, userStudyChannelList);
    return channelRes;
  }

  @Override
  @Transactional
  public void modifyChannel(Long userId, Long studyChannelId,
      StudyChannelModifyReq channelModifyReq) {
    StudyChannel studyChannel = studyChannelRepository.findById(studyChannelId)
        .orElseThrow(StudyChannelNotFoundException::new);
    if (!studyChannel.getEnabled()) {
      throw new StudyChannelNotFoundException();
    }
    // Host만 수정 가능
    if (!isHost(userId, studyChannel)) {
      throw new NotHostException();
    }

    // addMember와 deletedMember 존재여부 확인
    isUser(channelModifyReq.getAddedMember());
    isUser(channelModifyReq.getDeletedMember());

    List<UserStudyChannel> deletedMember =
        getUserStudyChannelList(studyChannel, channelModifyReq.getDeletedMember());

    studyChannel.setHostId(channelModifyReq.getHostId());
    studyChannel.setName(channelModifyReq.getName());
    studyChannelRepository.save(studyChannel);

    log.info("Updated Study Channel ID: {}", studyChannelId);

    createUserStudyChannel(studyChannel, channelModifyReq.getAddedMember());
    deleteUserStudyChannelList(deletedMember);

    log.info("Updated User Study Channel ID: {}", studyChannelId);

  }

  @Override
  @Transactional
  public void deleteChannel(Long userId, Long studyChannelId) {
    StudyChannel studyChannel = studyChannelRepository.findById(studyChannelId)
        .orElseThrow(StudyChannelNotFoundException::new);

    if (!isHost(userId, studyChannel)) {

      UserStudyChannel userStudyChannel = getUserStudyChannel(studyChannel, userId);
      deleteUserStudyChannel(userStudyChannel);

      log.info("Deleted User Study Channel ID: {}", userId);

    } else {

      List<UserStudyChannel> deletedMember =
          userStudyChannelRepository.findAllByStudyChannelId(studyChannelId);
      deleteUserStudyChannelList(deletedMember);
      log.info("Deleted All User Study Channel ID: {}", studyChannelId);

      studyChannel.setEnabled(false);
      studyChannelRepository.save(studyChannel);

      log.info("Deleted Study Channel ID: {}", studyChannelId);
    }

  }

  @Override
  public StudyChannelListRes getChannelList(Long userId) {
    List<UserStudyChannel> userStudyChannelList =
        userStudyChannelRepository.findAllByUserId(userId);
    StudyChannelListRes channelListRes = new StudyChannelListRes(userStudyChannelList);

    return channelListRes;
  }

  @Override
  public List<StudyChannelMemberDto> getMemberList(Long studyChannelId) {
    StudyChannel studyChannel = studyChannelRepository.findById(studyChannelId)
        .orElseThrow(StudyChannelNotFoundException::new);
    if (!studyChannel.getEnabled()) {
      throw new StudyChannelNotFoundException();
    }

    List<UserStudyChannel> userStudyChannelList =
        userStudyChannelRepository.findAllByStudyChannelId(studyChannelId);
    userStudyChannelList = userStudyChannelList.stream().filter(UserStudyChannel::isEnabled)
        .collect(Collectors.toList());

    List<StudyChannelMemberDto> memberList = new LinkedList<StudyChannelMemberDto>();
    userStudyChannelList.stream().forEach(list -> {
      memberList.add(new StudyChannelMemberDto(list.getUser()));
    });

    return memberList;
  }

  private boolean isUser(List<Long> member) {
    member.stream().forEach((userId) -> {
      userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    });
    return true;
  }

  private boolean isHost(Long userId, StudyChannel studyChannel) {
    if (studyChannel.getHostId() != userId) {
      return false;
    }
    return true;
  }

  private void createUserStudyChannel(StudyChannel studyChannel, List<Long> memberList) {

    memberList.stream().forEach(userId -> {
      UserStudyChannelId userStudyChannelId = new UserStudyChannelId(userId, studyChannel.getId());

      UserStudyChannel userStudyChannel = UserStudyChannel.builder()
          .userStudyChannelId(userStudyChannelId).studyChannel(studyChannel)
          .user(userRepository.findById(userId).orElseThrow(UserNotFoundException::new))
          .enabled(true).build();

      userStudyChannelRepository.save(userStudyChannel);
    });

  }

  private UserStudyChannel getUserStudyChannel(StudyChannel studyChannel, Long userId) {

    UserStudyChannelId userStudyChannelId = new UserStudyChannelId(userId, studyChannel.getId());
    UserStudyChannel userStudyChannel = userStudyChannelRepository.findById(userStudyChannelId)
        .orElseThrow(UserStudyChannelNotFoundException::new);

    return userStudyChannel;
  }

  private List<UserStudyChannel> getUserStudyChannelList(StudyChannel studyChannel,
      List<Long> memberList) {
    List<UserStudyChannel> member = new LinkedList<UserStudyChannel>();

    memberList.stream().forEach(userId -> {
      UserStudyChannelId userStudyChannelId = new UserStudyChannelId(userId, studyChannel.getId());
      UserStudyChannel userStudyChannel = userStudyChannelRepository.findById(userStudyChannelId)
          .orElseThrow(UserStudyChannelNotFoundException::new);
      member.add(userStudyChannel);
    });

    return member;
  }

  private void deleteUserStudyChannel(UserStudyChannel userStudyChannel) {

    userStudyChannel.setEnabled(false);
    userStudyChannelRepository.save(userStudyChannel);
  }

  private void deleteUserStudyChannelList(List<UserStudyChannel> member) {

    member.stream().forEach(userStudyChannel -> {
      userStudyChannel.setEnabled(false);
      userStudyChannelRepository.save(userStudyChannel);
    });
  }
}
