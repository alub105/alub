package com.a105.alub.api.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.NoticeCreateReq;
import com.a105.alub.api.request.NoticeModifyReq;
import com.a105.alub.api.response.NoticeCreateRes;
import com.a105.alub.api.response.NoticeDto;
import com.a105.alub.api.response.NoticeRes;
import com.a105.alub.api.service.NoticeService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.security.CurrentUser;
import com.a105.alub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Slf4j
@RequestMapping("/api/channels/{channelId}/notices")
@RestController
@RequiredArgsConstructor
public class NoticeController {

  private final NoticeService noticeService;

  @PostMapping("")
  public ApiResponseDto<NoticeCreateRes> createNotice(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal, @PathVariable Long channelId,
      @RequestBody NoticeCreateReq channelCreateReq) {
    NoticeCreateRes noticeCreateRes =
        noticeService.createNotice(userPrincipal.getId(), channelId, channelCreateReq);
    return ApiResponseDto.success(noticeCreateRes);
  }

  @GetMapping("")
  public ApiResponseDto<List<NoticeDto>> getNoticeList(
      @ApiIgnore @CurrentUser UserPrincipal userPrincipal, @PathVariable Long channelId) {
    List<NoticeDto> noticeList = noticeService.getNoticeList(channelId);
    return ApiResponseDto.success(noticeList);
  }

  @GetMapping("/{noticeId}")
  public ApiResponseDto<NoticeRes> getNotice(@PathVariable Long channelId,
      @PathVariable Long noticeId) {
    NoticeRes noticeRes = noticeService.getNotice(channelId, noticeId);
    return ApiResponseDto.success(noticeRes);
  }

  @PatchMapping("/{noticeId}")
  public ApiResponseDto<String> modifyNotice(@ApiIgnore @CurrentUser UserPrincipal userPrincipal,
      @PathVariable Long channelId, @PathVariable Long noticeId,
      @RequestBody NoticeModifyReq noticeModifyReq) {
    noticeService.modifyNotice(userPrincipal.getId(), channelId, noticeId, noticeModifyReq);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }

  @DeleteMapping("/{noticeId}")
  public ApiResponseDto<String> deleteNotice(@ApiIgnore @CurrentUser UserPrincipal userPrincipal,
      @PathVariable Long channelId, @PathVariable Long noticeId) {
    noticeService.deleteNotice(userPrincipal.getId(), channelId, noticeId);
    return ApiResponseDto.DEFAULT_SUCCESS;
  }
}
