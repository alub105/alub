package com.a105.alub.api.service;

import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.request.RepoSetReq;
import com.a105.alub.api.response.GithubRepoRes;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.MyInfoRes;
import com.a105.alub.domain.enums.Platform;
import com.a105.alub.security.UserPrincipal;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService {

  LoginRes login(LoginReq loginReq);

  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

  UserDetails loadUserByUsername(String username, Platform platform)
      throws UsernameNotFoundException;

  MyInfoRes getMyInfo(Long userId);

  ConfigsRes getConfigs(Long userId);

  void updateConfigs(Long userId, ConfigsReq configsReq);

  List<GithubRepoRes> getGithubPublicRepos(Long userId);

  GithubRepoRes getGithubRepo(Long userId, String repoName);

  void setAlubRepo(Long userId, RepoSetReq repoSetReq);
}
