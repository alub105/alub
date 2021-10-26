package com.a105.alub.domain.entity;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import com.a105.alub.domain.enums.AuthProvider;
import com.a105.alub.domain.enums.CommitType;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String email;

  private String imageUrl;
  
  @Enumerated(EnumType.STRING)
  private AuthProvider provider;

  private String providerId;
  
  private String repoName;
  
  private String dirName;
  
  private CommitType commit;
  
  private Boolean timerShown;
  
  private String timerDefaultTime;
  
  private String githubAccessToken;
}
