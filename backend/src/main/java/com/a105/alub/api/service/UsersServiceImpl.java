package com.a105.alub.api.service;

import com.a105.alub.api.response.UserSearchDto;
import com.a105.alub.domain.specs.UserSpecs;
import com.a105.alub.domain.specs.UserSpecs.SearchKey;
import com.a105.alub.domain.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

  private final UserRepository userRepository;

  @Override
  public List<UserSearchDto> searchWith(Map<SearchKey, Object> searchKeys) {
    return userRepository.findAll(UserSpecs.searchWith(searchKeys))
        .stream().map(UserSearchDto::of).collect(Collectors.toList());
  }
}
