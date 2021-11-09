package com.a105.alub.domain.entity;

import java.io.Serializable;
import javax.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class ProblemId implements Serializable {

  private final Long num;

  private final String site;


}
