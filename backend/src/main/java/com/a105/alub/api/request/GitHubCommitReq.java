package com.a105.alub.api.request;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import com.a105.alub.domain.enums.Site;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GitHubCommitReq {
  @JsonProperty("message")
  String commitMessage;
  @JsonProperty("content")
  String srcCode;
  // @JsonProperty("sha")
  // String sha;

  public GitHubCommitReq(CommitReq commitReq
  // , String sha
  ) {
    LocalDateTime now = LocalDateTime.now();
    this.commitMessage = makeCommitMessage(commitReq, now);
    this.srcCode = addCommentToSrcCode(commitReq, now);
    // this.sha = sha;
  }

  private String makeCommitMessage(CommitReq commitReq, LocalDateTime now) {
    String commitMessage = (commitReq.getSite() == Site.BOJ ? "BOJ-" : "PRGMS-")
        + commitReq.getProblemNum() + " '" + commitReq.getProblemName() + "' [ "
        + now.format(DateTimeFormatter.ofPattern("yy/MM/dd HH:mm:ss")) + " ] by Alub";
    return commitMessage;
  }

  private String addCommentToSrcCode(CommitReq commitReq, LocalDateTime now) {
    String srcCode = "/*\n" + "* 메모리: " + commitReq.getRunningMemory() + " KB, 시간: "
        + commitReq.getRunningTime() + " ms\n* 타이머 시간: " + commitReq.getTimer() + "\n* "
        + now.format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) + "\n* by Alub\n**/\n"
        + commitReq.getSrcCode();
    String message = Base64.getEncoder().encodeToString(srcCode.getBytes()).toString();
    return message;
  }
}
