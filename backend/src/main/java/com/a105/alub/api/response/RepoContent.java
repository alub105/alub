package com.a105.alub.api.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RepoContent {
    private GithubContentType type;
    private String name;
    private String path;
}
