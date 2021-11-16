package com.a105.alub.domain.entity;

import com.a105.alub.api.request.AssignedProblemReq;
import com.a105.alub.domain.enums.BojLevel;
import com.a105.alub.domain.enums.ProblemLevel;
import com.a105.alub.domain.enums.Site;
import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
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
public class AssignedProblem extends BaseTimeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "study_id")
  private Study study;

  private Long num;

  private String title;

  @Enumerated(EnumType.STRING)
  private Site site;

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


  public AssignedProblem(AssignedProblemReq assignedProblemReq, Study study) {
    this.num = assignedProblemReq.getNum();
    this.title = assignedProblemReq.getTitle();
    this.site = assignedProblemReq.getSite();
    this.level = assignedProblemReq.getLevel();
    this.study = study;
  }

}
