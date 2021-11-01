package com.a105.alub.security;

import java.util.Optional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.a105.alub.api.response.GithubTokenRes;
import com.a105.alub.api.response.GithubUserRes;
import com.a105.alub.domain.entity.User;
import com.a105.alub.domain.enums.AuthProvider;
import com.a105.alub.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GitHubAuthenticate {

  private final UserRepository userRepository;
  private final TokenProvider tokenProvider;

  public String getJwtToken(UserDetails userDetails) {

    // 사용자 principal과 credential 정보 Authentication에 담기
    // UsernamePasswordAuthenticationToken가 Authentication을 상속받는 AbstractAuthenticationToken을 상속 받고
    // 있음
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    // Authentication는 SecurityContext에 보관
    // SecurityContext는 SecurityContextHolder에 보관
    SecurityContextHolder.getContext().setAuthentication(authentication);

    return tokenProvider.createToken(authentication);
  }

  public User checkUser(GithubTokenRes githubTokenRes, GithubUserRes githubUserRes) {
    Optional<User> userOptional = userRepository.findByName(githubUserRes.getLogin());
    User user;
    if (userOptional.isPresent()) {
      user = userOptional.get();
      user = updateExistingUser(user, githubUserRes, githubTokenRes.getAccessToken());
    } else {
      user = registerNewUser(githubUserRes, githubTokenRes.getAccessToken());
    }

    return user;
  }


  /**
   * DB에 저장하기
   * 
   * @param githubUserRes github에서 가져온 유저 정보
   * @param accessToken github access_token
   * @return User
   */
  private User registerNewUser(GithubUserRes githubUserRes, String accessToken) {
    User user = User.builder()
        .name(githubUserRes.getLogin())
        .email(githubUserRes.getEmail())
        .imageUrl(githubUserRes.getAvatarUrl())
        .provider(AuthProvider.github)
        .providerId(githubUserRes.getId())
        .githubAccessToken(accessToken)
        .build();
    return userRepository.save(user);
  }

  /**
   * 이미 존재하는 user 정보 update
   * 
   * @param user 존재하는 user
   * @param githubUserRes github에서 가져온 유저 정보
   * @param accessToken github access_token
   * @return User
   */
  private User updateExistingUser(User user, GithubUserRes githubUserRes, String accessToken) {
    user.setName(githubUserRes.getLogin());
    user.setImageUrl(githubUserRes.getAvatarUrl());
    user.setGithubAccessToken(accessToken);
    return userRepository.save(user);
  }

}
