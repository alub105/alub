package com.a105.alub.api.request;

import com.a105.alub.domain.enums.CommitType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ConfigsReq {
  
  private CommitType commit;
  private String timerDefaultTime;
  private boolean timerShown;
  
}
