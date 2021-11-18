export const SET_SELECTED_CHANNEL = "study/SET_SELECTED_CHANNEL";

export const SET_CHANNEL_LIST = "study/SET_CHANNEL_LIST";

export const UPDATE_CHANNEL_LIST = "study/UPDATE_CHANNEL_LIST";

export const DELETE_CHANNEL = "study/DELETE_CHANNEL";

export const UPDATE_CHANNEL = "study/UPDATE_CHANNEL";

export const SET_RUNNING_STUDY_LIST = "study/SET_RUNNING_STUDY_LIST";

export const ADD_RUNNING_STUDY_LIST = "study/ADD_RUNNING_STUDY_LIST";

export const SET_ENDED_STUDY_LIST = "study/SET_ENDED_STUDY_LIST";

// -1: profile, -2: home
export const setSelectedChannel = (id) => ({
  type: SET_SELECTED_CHANNEL,
  payload: id,
});

export const setChannelList = (channelInfo) => ({
  type: SET_CHANNEL_LIST,
  payload: channelInfo,
});

export const updateChannelList = (channel) => ({
  type: UPDATE_CHANNEL_LIST,
  payload: channel,
});

export const deleteChannel = (id) => ({
  type: DELETE_CHANNEL,
  payload: id,
});

export const updateChannel = (channelInfo) => ({
  type: UPDATE_CHANNEL,
  payload: channelInfo,
});

export const setRunningStudyList = (studyList) => ({
  type: SET_RUNNING_STUDY_LIST,
  payload: studyList,
});

export const addRunningStudyList = (studyList) => ({
  type: ADD_RUNNING_STUDY_LIST,
  payload: studyList,
});

export const setEndedStuyList = (studyList) => ({
  type: SET_ENDED_STUDY_LIST,
  payload: studyList,
});
