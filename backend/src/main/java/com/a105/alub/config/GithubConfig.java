package com.a105.alub.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Data
@EnableAsync
@Configuration
@ConfigurationProperties(prefix = "github")
public class GithubConfig {

  private String clientId;
  private String clientSecret;

}
