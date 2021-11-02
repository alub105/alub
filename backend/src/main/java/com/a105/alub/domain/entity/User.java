package com.a105.alub.domain.entity;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import com.a105.alub.domain.enums.AuthProvider;
import com.a105.alub.domain.enums.CommitType;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class User extends BaseTimeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  
  private String email;

  private String imageUrl;
  
  @Enumerated(EnumType.STRING)
  private AuthProvider provider;

  private Long providerId;
  
  private String repoName;
  
  private String dirPath;
  
  @Enumerated(EnumType.STRING)
  @ColumnDefault("'DEFAULT'")
  private CommitType commit;
  
  @ColumnDefault("true")
  private Boolean timerShown;
  
  @ColumnDefault("'00:00:00'")
  private String timerDefaultTime;
  
  private String githubAccessToken;
}
