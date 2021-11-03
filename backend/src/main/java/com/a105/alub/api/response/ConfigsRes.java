package com.a105.alub.api.response;

import com.a105.alub.domain.enums.CommitType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ConfigsRes {
  
  private CommitType commit;
  private String timerDefaultTime;
  private Boolean timerShown;
  private String repoName;
  private String dirPath;
  
}
