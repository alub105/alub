package com.a105.alub.api.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@RequiredArgsConstructor
@ToString
public class GithubRepoRes {
  private final String name;

  public static GithubRepoRes of(GithubRepo githubRepo) {
    return new GithubRepoRes(githubRepo.getName());
  }
}
