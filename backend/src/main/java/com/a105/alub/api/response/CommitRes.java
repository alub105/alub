package com.a105.alub.api.response;

import java.util.Map;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CommitRes {
  String filePath;

  public CommitRes(Map<String, String> uriPathVariables) {
    StringBuilder uri = new StringBuilder();
    uri.append(uriPathVariables.get("userName"));
    String dirPath = uriPathVariables.getOrDefault("dirPath", "");
    if (!dirPath.equals("")) {
      uri.append("/"+dirPath);
    }
    uri.append("/" + uriPathVariables.get("repoName"));
    uri.append("/" + uriPathVariables.get("site"));
    uri.append("/" + uriPathVariables.get("problemNum"));
    uri.append("/" + uriPathVariables.get("fileName"));
    this.filePath = uri.toString();
  }
}
