package com.a105.alub.api.controller;

import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.StudyDto;
import com.a105.alub.api.service.StudyService;
import com.a105.alub.common.response.ApiResponseDto;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
  public ApiResponseDto<StudyDto> createStudy(@PathVariable Long channelId,
      @RequestBody StudyCreateReq studyCreateReq) {

    StudyDto studyDto = studyService.createStudy(channelId, studyCreateReq);
    return ApiResponseDto.success(studyDto);
  }
}
