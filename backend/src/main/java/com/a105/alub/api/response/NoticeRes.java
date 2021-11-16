package com.a105.alub.api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class NoticeRes {
  String title;
  String content;
  String writer;
  String createdTime;
}
