package com.a105.alub.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Locale;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public class Readme {
  @JsonProperty("message")
  private final String commitMessage;
  private final String content;

  public Readme(String commitMessage, String content) {
    this.commitMessage = commitMessage;
    this.content = Base64.getEncoder().encodeToString(content.getBytes(StandardCharsets.UTF_8));
  }
}
