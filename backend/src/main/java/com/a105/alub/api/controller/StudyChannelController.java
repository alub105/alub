package com.a105.alub.api.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.StudyChannelCreateReq;
import com.a105.alub.api.request.StudyChannelModifyReq;
import com.a105.alub.api.response.StudyChannelListRes;
import com.a105.alub.api.response.StudyChannelRes;
import com.a105.alub.api.service.StudyChannelService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.security.CurrentUser;
import com.a105.alub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Slf4j
@RequestMapping("/api/channels")
@RestController
@RequiredArgsConstructor
public class StudyChannelController {

  private final StudyChannelService studyChannelService;

  @PostMapping("")
  public ApiResponseDto<String> createStudyChannel(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal,
      @RequestBody StudyChannelCreateReq channelCreateReq) {
    studyChannelService.createChannel(userPrincipal.getId(), channelCreateReq);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }

  @GetMapping("/{channelId}")
  public ApiResponseDto<StudyChannelRes> getStudyChannel(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal, @PathVariable Long channelId) {
    StudyChannelRes channelRes = studyChannelService.getChannel(channelId);
    return ApiResponseDto.success(channelRes);
  }

  @PutMapping("/{channelId}")
  public ApiResponseDto<String> modifyStudyChannel(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal, @PathVariable Long channelId,
      @RequestBody StudyChannelModifyReq channelModifyReq) {
    studyChannelService.modifyChannel(userPrincipal.getId(), channelId, channelModifyReq);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }

  @DeleteMapping("/{channelId}")
  public ApiResponseDto<String> deleteStudyChannel(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal, @PathVariable Long channelId) {
    studyChannelService.deleteChannel(userPrincipal.getId(), channelId);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }

  @GetMapping("//mychannels")
  public ApiResponseDto<StudyChannelListRes> getStudyChannelList(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal) {
    StudyChannelListRes channelListRes = studyChannelService.getChannelList(userPrincipal.getId());
    return ApiResponseDto.success(channelListRes);
  }
}
