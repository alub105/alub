package com.a105.alub.api.request;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class StudyChannelCreateReq {
  String name;
  List<Long> memberId;
}
