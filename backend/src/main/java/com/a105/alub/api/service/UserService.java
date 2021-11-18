package com.a105.alub.api.service;

import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.a105.alub.api.request.CommitReq;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.FileGetReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.request.RepoSetReq;
import com.a105.alub.api.response.CommitRes;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.FileGetRes;
import com.a105.alub.api.response.GithubRepoRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.api.response.MyInfoRes;
import com.a105.alub.domain.enums.Platform;

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

  FileGetRes getFile(Long id, FileGetReq fileGetReq);

  CommitRes commit(Long id, CommitReq commitReq);
}
