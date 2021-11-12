package com.a105.alub.api.response;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class FileGetRes {
  String fileName;
  String contents;

  public FileGetRes(GithubFileContentRes githubFileContentRes) {
    this.fileName = githubFileContentRes.getName();
    this.contents = githubFileContentRes.getContent();
  }
}
