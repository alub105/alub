package com.a105.alub.api.service;

import com.a105.alub.api.request.AssignedProblemReq;
import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.AssignedProblemCreateRes;
import com.a105.alub.api.response.StudiesGetRes;
import com.a105.alub.api.response.StudyCreateRes;
import com.a105.alub.api.response.AssignedProblemGetRes;
import com.a105.alub.api.response.SolvedGetRes;
import com.a105.alub.api.response.StudyGetRes;
import com.a105.alub.api.response.StudyGetSimpleRes;
import com.a105.alub.common.exception.SolvedNotFoundException;
import com.a105.alub.common.exception.StudyChannelNotFoundException;
import com.a105.alub.common.exception.StudyNotFoundException;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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

  @Override
  public StudiesGetRes findByStudyChannelId(Long studyChannelId) {

    List<Study> studies = studyRepository.findByStudyChannel_Id(studyChannelId);

    LocalDateTime now = LocalDateTime.now();
    Map<Boolean, List<Study>> studiesGroup = studies.stream()
        .collect(Collectors.partitioningBy(x -> now.isAfter(x.getEndTime())));

    List<StudyGetSimpleRes> runningStudies = studiesGroup.get(false).stream()
        .sorted(Comparator.comparing(Study::getAssignmentStartTime))
        .limit(5)
        .map(StudyGetSimpleRes::of)
        .collect(Collectors.toList());

    List<StudyGetSimpleRes> endedStudies = studiesGroup.get(true).stream()
        .sorted(Comparator.comparing(Study::getEndTime).reversed())
        .limit(5)
        .map(StudyGetSimpleRes::of)
        .collect(Collectors.toList());

    return new StudiesGetRes(runningStudies, endedStudies);
  }

  @Override
  public StudyGetRes findById(Long studyId) {
    Study study = studyRepository.findById(studyId).orElseThrow(StudyNotFoundException::new);

    List<User> members = userStudyChannelRepository
        .findAllByStudyChannelId(study.getStudyChannel().getId())
        .stream().map(UserStudyChannel::getUser).collect(Collectors.toList());

    List<AssignedProblemGetRes> list = new ArrayList<>();

    List<AssignedProblem> problems = assignedProblemRepository.findByStudyId(study.getId());
    for (AssignedProblem problem : problems) {
      List<SolvedGetRes> solvedGetResList = new ArrayList<>();
      for (User member : members) {
        Solved solved = solvedRepository
            .findByUser_IdAndAssignedProblem_Id(member.getId(), problem.getId())
            .orElseThrow(SolvedNotFoundException::new);

        solvedGetResList.add(new SolvedGetRes(member, solved));
      }
      AssignedProblemGetRes dto = new AssignedProblemGetRes(problem, solvedGetResList);
      list.add(dto);
    }
    StudyGetRes studyGetRes = new StudyGetRes(study, list);
    return studyGetRes;
  }
}
