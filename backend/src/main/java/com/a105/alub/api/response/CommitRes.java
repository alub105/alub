package com.a105.alub.api.response;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CommitRes {
  String filePath;

  public CommitRes(String url) {
    url = url.replaceAll("repos", "");
    url = url.replaceAll("contents/", "");
    url = url.replaceAll("//", "/");
    this.filePath = url;
  }
}
