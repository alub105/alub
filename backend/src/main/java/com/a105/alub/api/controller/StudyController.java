package com.a105.alub.api.controller;

import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.StudiesGetRes;
import com.a105.alub.api.response.StudyCreateRes;
import com.a105.alub.api.response.StudyGetRes;
import com.a105.alub.api.service.StudyService;
import com.a105.alub.common.response.ApiResponseDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/api/channels/{channelId}/studies")
@RestController
@RequiredArgsConstructor
public class StudyController {

  private final StudyService studyService;

  @PostMapping("")
  public ApiResponseDto<StudyCreateRes> createStudy(@PathVariable Long channelId,
      @RequestBody StudyCreateReq studyCreateReq) {

    StudyCreateRes studyCreateRes = studyService.createStudy(channelId, studyCreateReq);
    return ApiResponseDto.success(studyCreateRes);
  }

  @GetMapping("")
  public ApiResponseDto<StudiesGetRes> getStudies(@PathVariable Long channelId) {

    StudiesGetRes studiesGetRes = studyService.findByStudyChannelId(channelId);
    return ApiResponseDto.success(studiesGetRes);
  }

  @GetMapping("/{studyId}")
  public ApiResponseDto<StudyGetRes> getStudy(@PathVariable Long channelId,
      @PathVariable Long studyId) {

    StudyGetRes studyGetRes = studyService.findById(studyId);
    return ApiResponseDto.success(studyGetRes);
  }
}
