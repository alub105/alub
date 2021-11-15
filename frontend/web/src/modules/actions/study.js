export const SET_SELECTED_CHANNEL = "study/SET_SELECTED_CHANNEL";

export const SET_CHANNEL_LIST = "study/SET_CHANNEL_LIST";

export const SET_STUDY_INFO = "study/SET_STUDY_INFO";

// -1: profile, -2: home
export const setSelectedChannel = (id) => ({
  type: SET_SELECTED_CHANNEL,
  payload: id,
});

export const setChannelList = (channelInfo) => ({
  type: SET_CHANNEL_LIST,
  payload: channelInfo,
});

export const setStudyInfo = (studyInfo) => ({
  type: SET_STUDY_INFO,
  payload: studyInfo,
});
