package com.a105.alub.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class NoticeModifyReq {
  String title;
  String content;
}
