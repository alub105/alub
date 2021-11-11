package com.a105.alub.api.controller;

import com.a105.alub.api.response.UserSearchDto;
import com.a105.alub.api.service.UsersService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.domain.specs.UserSpecs.SearchKey;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/api/users")
@RestController
@RequiredArgsConstructor
public class UsersController {

  private final UsersService usersService;

  @PostMapping("/searches")
  public ApiResponseDto<?> search(@RequestBody Map<String, Object> request) {
    log.info("GET /users/saerches - request : {}", request.entrySet().toArray());

    Map<String, Object> terms = (Map<String, Object>) request.get("terms");
    Map<SearchKey, Object> searchKeys = new EnumMap<>(SearchKey.class);
    for (String key : terms.keySet()) {
      searchKeys.put(SearchKey.valueOf(key.toUpperCase()), terms.get(key));
    }
    if (searchKeys.isEmpty()) {
      throw new IllegalArgumentException("search key가 비어 있습니다.");
    }

    List<UserSearchDto> userSearchDtoList = usersService.searchWith(searchKeys);
    return ApiResponseDto.success(userSearchDtoList);
  }

}
