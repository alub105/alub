package com.a105.alub.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import org.hibernate.annotations.ColumnDefault;
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
public class Solved extends BaseTimeEntity {

  @EmbeddedId
  private SolvedId solvedId = new SolvedId();

  @MapsId("userId")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @MapsId("assignedProblemId")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assigned_problem_id")
  private AssignedProblem assignedProblem;

  @ColumnDefault("false")
  private boolean solved;

  private LocalDateTime solvedTime;

  public Solved(User user, AssignedProblem assignedProblem) {
    this.user = user;
    this.assignedProblem = assignedProblem;
  }

  public void solveAssignedProblem(LocalDateTime solvedTime) {
    if (!this.solved) {
      this.solved = true;
      this.solvedTime = solvedTime;
    }
  }

}
