package com.a105.alub.domain.entity;

import com.a105.alub.domain.enums.BojLevel;
import com.a105.alub.domain.enums.ProblemLevel;
import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Problem {

  @EmbeddedId
  private ProblemId problemId;

  private String title;

  private ProblemLevel level;

  @Basic
  @Access(AccessType.PROPERTY)
  @Column(name = "level", nullable = false)
  public String getLevel() {
    return level.getName();
  }

  public void setLevel(String level) {
    if (BojLevel.hasName(level)) {
      this.level = BojLevel.valueOf(level);
    }
  }

  public ProblemLevel getProblemLevel() {
    return level;
  }

}
