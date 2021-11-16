package com.a105.alub.api.service;

import com.a105.alub.api.request.AssignedProblemReq;
import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.AssignedProblemCreateRes;
import com.a105.alub.api.response.StudyCreateRes;
import com.a105.alub.common.exception.StudyChannelNotFoundException;
import com.a105.alub.domain.entity.AssignedProblem;
import com.a105.alub.domain.entity.Solved;
import com.a105.alub.domain.entity.Study;
import com.a105.alub.domain.entity.StudyChannel;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.entity.UserStudyChannel;
import com.a105.alub.domain.repository.AssignedProblemRepository;
import com.a105.alub.domain.repository.SolvedRepository;
import com.a105.alub.domain.repository.StudyChannelRepository;
import com.a105.alub.domain.repository.StudyRepository;
import com.a105.alub.domain.repository.UserStudyChannelRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

  private final StudyRepository studyRepository;
  private final StudyChannelRepository studyChannelRepository;
  private final AssignedProblemRepository assignedProblemRepository;
  private final SolvedRepository solvedRepository;
  private final UserStudyChannelRepository userStudyChannelRepository;

  @Transactional
  @Override
  public StudyCreateRes createStudy(Long channelId, StudyCreateReq studyCreateReq) {
    StudyChannel studyChannel = studyChannelRepository.findById(channelId)
        .orElseThrow(StudyChannelNotFoundException::new);

    List<User> members = userStudyChannelRepository.findAllByStudyChannelId(studyChannel.getId())
        .stream().map(UserStudyChannel::getUser).collect(Collectors.toList());

    List<AssignedProblemCreateRes> createdAssignedProblems = new ArrayList<>();
    Study createdStudy = studyRepository.save(new Study(studyCreateReq, studyChannel));
    for (AssignedProblemReq assignedProblemReq : studyCreateReq.getAssignedProblems()) {
      AssignedProblem assignedProblem = new AssignedProblem(assignedProblemReq, createdStudy);
      assignedProblem = assignedProblemRepository.save(assignedProblem);
      for (User member : members) {
        solvedRepository.save(new Solved(member, assignedProblem));
      }
      createdAssignedProblems.add(AssignedProblemCreateRes.of(assignedProblem));
    }

    return new StudyCreateRes(createdStudy, createdAssignedProblems);
  }
}
