package com.a105.alub.api.service;

import javax.persistence.spi.LoadState;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.a105.alub.api.request.GithubTokenReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.GithubTokenRes;
import com.a105.alub.api.response.GithubUserRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.config.GithubConfig;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.enums.Platform;
import com.a105.alub.domain.repository.UserRepository;
import com.a105.alub.security.GitHubAuthenticate;
import com.a105.alub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final GithubConfig githubConfig;
  private final UserRepository userRepository;
  private final GitHubAuthenticate gitHubAuthenticate;
  
  WebClient webClient = WebClient.builder().baseUrl("https://github.com")
      .defaultHeader("CONTENT-TYPE", "application/json").defaultHeader("Accept", "application/json")
      .build();

  @Override
  public LoginRes login(LoginReq loginReq) {

    GithubTokenRes githubTokenRes = getAccessToken(loginReq.getCode());
    log.info("Github Access Token Response: {}", githubTokenRes);

    GithubUserRes githubUserRes = getGithubUser(githubTokenRes.getAccessToken());

    User user = gitHubAuthenticate.checkUser(githubTokenRes, githubUserRes);
    
    UserDetails userDetails = loadUserByUsername(user.getName(), loginReq.getPlatform());
    
    log.info("User Details: {}", userDetails);
    
    String token = gitHubAuthenticate.getJwtToken(userDetails, loginReq.getPlatform());
    return LoginRes.builder().userId(user.getId()).name(user.getName()).email(user.getEmail())
        .imageUrl(user.getImageUrl()).token(token).build();
  }


  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByName(username)
        .orElseThrow(() -> new UsernameNotFoundException(username));
    return UserPrincipal.create(user);
  }

  @Override
  public UserDetails loadUserByUsername(String username, Platform platform) throws UsernameNotFoundException {
    User user = userRepository.findByName(username)
        .orElseThrow(() -> new UsernameNotFoundException(username));
    return UserPrincipal.create(user, platform);
  }
  
  /**
   * github의 user 정보 가져오기
   * 
   * @param githubAccessToken user 정보가져오기 위한 access_token
   * @return github 유저 정보
   */
  private GithubUserRes getGithubUser(String githubAccessToken) {
    return webClient.get().uri("https://api.github.com/user")
        .header("Authorization", "token " + githubAccessToken).retrieve()
        .bodyToMono(GithubUserRes.class).block();
  }

  /**
   * code를 통해 github access_token 받아오기
   * 
   * @param code github에서 제공하는 인증 code (?)
   * @return GithubTokenRes
   */
  private GithubTokenRes getAccessToken(String code) {
    GithubTokenReq githubTokenReq = GithubTokenReq.builder().code(code)
        .clientId(githubConfig.getClientId()).clientSecret(githubConfig.getClientSecret()).build();

    log.info("Github Access Token Request: {}", githubTokenReq);

    return webClient.post().uri("/login/oauth/access_token").bodyValue(githubTokenReq).retrieve()
        .bodyToMono(GithubTokenRes.class).block();
  }


}
