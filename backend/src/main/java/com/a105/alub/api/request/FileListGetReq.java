package com.a105.alub.api.request;

import com.a105.alub.domain.enums.Site;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Builder
public class FileListGetReq {
  Long userId;
  Site site;
  String problemNum;
}
