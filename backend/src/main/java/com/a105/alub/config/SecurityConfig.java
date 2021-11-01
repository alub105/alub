package com.a105.alub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.a105.alub.security.RestAuthenticationEntryPoint;
import com.a105.alub.security.TokenAuthenticationFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Bean
  public TokenAuthenticationFilter tokenAuthenticationFilter() {
    return new TokenAuthenticationFilter();
  }

  // swagger 관련 리소스 시큐리티 필터 제거
  @Override
  public void configure(WebSecurity web) throws Exception {
    web.ignoring().antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html",
        "/webjars/**", "/swagger/**", "/swagger-ui/**");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .cors()
      .and()
      .sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .csrf()
      .disable()
      .formLogin()
      .disable()
      .httpBasic()
      .disable()
      .exceptionHandling()
      .authenticationEntryPoint(new RestAuthenticationEntryPoint())
      .and()
      .authorizeRequests()
      .antMatchers("/api/user/authenticate")
      .permitAll()
      .anyRequest()
      .authenticated()
    ;

    // Add our custom Token based authentication filter
    http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}
