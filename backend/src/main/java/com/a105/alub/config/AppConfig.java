package com.a105.alub.config;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Data
@EnableAsync
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {

  private List<String> authorizedRedirectUris = new ArrayList<>();

  private String tokenSecret;

  private long tokenExpirationExtension;
  private long tokenExpirationWeb;

}
