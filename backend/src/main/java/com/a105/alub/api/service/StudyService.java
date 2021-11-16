package com.a105.alub.api.service;

import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.StudyDto;

public interface StudyService {
  StudyDto createStudy(Long channelId, StudyCreateReq studyCreateReq);

}
