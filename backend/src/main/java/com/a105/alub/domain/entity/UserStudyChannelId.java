package com.a105.alub.domain.entity;

import java.io.Serializable;
import javax.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class UserStudyChannelId implements Serializable {

  private final Long userId;

  private final Long studyChannelId;

}
