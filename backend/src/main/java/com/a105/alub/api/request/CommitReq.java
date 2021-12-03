package com.a105.alub.api.request;

import java.sql.Time;
import com.a105.alub.domain.enums.CommitType;
import com.a105.alub.domain.enums.Site;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class CommitReq {
  String srcCode;
  CommitType commit;
  String fileName;
  String sha;
  String runningTime;
  String runningMemory;
  Time timer;
  Site site;
  String problemNum;
  String problemTitle;
  String language;
}
