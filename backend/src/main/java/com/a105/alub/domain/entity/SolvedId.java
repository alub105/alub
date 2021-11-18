package com.a105.alub.domain.entity;

import java.io.Serializable;
import javax.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
@Embeddable
public class SolvedId implements Serializable {

  private Long userId;

  private Long assignedProblemId;

}
