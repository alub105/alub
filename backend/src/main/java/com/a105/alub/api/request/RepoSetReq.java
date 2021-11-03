package com.a105.alub.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RepoSetReq {
    String repoName;
    String dirPath;
    boolean creation;
}
