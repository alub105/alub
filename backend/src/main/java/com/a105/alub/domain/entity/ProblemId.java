package com.a105.alub.domain.entity;

import com.a105.alub.domain.enums.Site;
import java.io.Serializable;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
@Embeddable
public class ProblemId implements Serializable {

  private Long num;

  @Enumerated(EnumType.STRING)
  private Site site;

}
