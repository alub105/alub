package com.a105.alub.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.reactive.function.client.WebClient;

@Data
@EnableAsync
@Configuration
@ConfigurationProperties(prefix = "github")
public class GithubConfig {

  private String clientId;
  private String clientSecret;

  @Bean
  public WebClient githubApiClient() {
    return WebClient.builder()
        .baseUrl("https://api.github.com")
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github.v3+json")
        .build();
  }
}
