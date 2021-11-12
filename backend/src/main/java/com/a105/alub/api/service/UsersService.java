package com.a105.alub.api.service;

import com.a105.alub.api.response.UserSearchDto;
import com.a105.alub.domain.specs.UserSpecs.SearchKey;
import java.util.List;
import java.util.Map;

public interface UsersService {
  List<UserSearchDto> searchWith(Map<SearchKey, Object> searchKeys);
}
