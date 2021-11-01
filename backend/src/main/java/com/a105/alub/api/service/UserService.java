package com.a105.alub.api.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import com.a105.alub.api.request.LoginReq;
import com.a105.alub.api.response.LoginRes;

public interface UserService extends UserDetailsService {
  
  LoginRes login(LoginReq loginReq);
}
