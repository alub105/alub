package com.a105.alub.api.response;

import com.a105.alub.domain.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@RequiredArgsConstructor
@ToString
@Builder
public class UserSearchDto {
  private final Long id;
  private final String name;

  public static UserSearchDto of(User user) {
    return new UserSearchDtoBuilder()
        .id(user.getId())
        .name(user.getName())
        .build();
  }
}
