package com.a105.alub.api.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GithubFileContentRes {
  String name;
  String sha;
  String content;
}
