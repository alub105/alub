package com.a105.alub.api.service;

import com.a105.alub.api.request.StudyCreateReq;
import com.a105.alub.api.response.StudyCreateRes;
import com.a105.alub.api.response.StudyGetRes;

public interface StudyService {
  StudyCreateRes createStudy(Long channelId, StudyCreateReq studyCreateReq);

  StudyGetRes findById(Long studyId);
}
