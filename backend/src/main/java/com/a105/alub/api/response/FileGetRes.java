package com.a105.alub.api.response;

import lombok.Getter;

@Getter
public class FileGetRes {
  String fileName;
  String contents;

  public FileGetRes(GithubFileContentRes githubFileContentRes) {
    this.fileName = githubFileContentRes.getName();
    this.contents = githubFileContentRes.getContent();
  }

  @Override
  public String toString() {
    return "FileGetRes [fileName=" + fileName + ", contents="
        + contents.substring(0, (contents.length() - 1) % 10) + "..." + "]";
  }

}
