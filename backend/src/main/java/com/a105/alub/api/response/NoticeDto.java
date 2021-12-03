package com.a105.alub.api.response;

import java.time.format.DateTimeFormatter;
import com.a105.alub.domain.entity.Notice;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class NoticeDto {
  Long id;
  String title;
  String createdTime;

  public NoticeDto(Notice notice) {
    this.id = notice.getId();
    this.title = notice.getTitle();
    this.createdTime =
        notice.getCreatedDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss"));
  }
}
