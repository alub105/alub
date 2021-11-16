package com.a105.alub.api.controller;

import java.io.IOException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.a105.alub.api.request.FileListGetReq;
import com.a105.alub.api.response.FileGetRes;
import com.a105.alub.api.response.UserSearchDto;
import com.a105.alub.api.service.UsersService;
import com.a105.alub.common.response.ApiResponseDto;
import com.a105.alub.domain.enums.Site;
import com.a105.alub.domain.specs.UserSpecs.SearchKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

  @GetMapping("/{userId}/sites/{siteName}/problems/{problemNum}/files")
  public ApiResponseDto<?> getGithubFile(@PathVariable Long userId, @PathVariable Site siteName,
      @PathVariable String problemNum) throws IOException {
    FileListGetReq fileListGetReq =
        FileListGetReq.builder().userId(userId).site(siteName).problemNum(problemNum).build();
    List<FileGetRes> fileList = usersService.getFileList(fileListGetReq);
    return ApiResponseDto.success(fileList);
  }
}
