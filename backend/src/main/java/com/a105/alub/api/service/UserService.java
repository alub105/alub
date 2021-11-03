package com.a105.alub.api.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.a105.alub.api.request.ConfigsReq;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.ConfigsRes;
import com.a105.alub.api.response.LoginRes;
import com.a105.alub.domain.enums.Platform;

public interface UserService extends UserDetailsService {
  
  LoginRes login(LoginReq loginReq);

  UserDetails loadUserByUsername(String username, Platform platform)
      throws UsernameNotFoundException;

  ConfigsRes getConfigs(String username);
  
  void updateConfigs(String name, ConfigsReq configsReq);
  
}
