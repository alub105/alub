export const SET_CHANNEL_LIST = "study/SET_CHANNEL_LIST";

export const SET_IS_CREATE_NEW_STUDY = "study/SET_CREATE_NEW_STUDY";

export const UPDATE_CHANNEL_LIST = "study/UPDATE_CHANNEL_LIST";

export const DELETE_CHANNEL = "study/DELETE_CHANNEL";

export const UPDATE_CHANNEL = "study/UPDATE_CHANNEL";

export const setChannelList = (channelInfo) => ({
  type: SET_CHANNEL_LIST,
  payload: channelInfo,
});

export const setIsCreateNewStudy = (isCreateNewStudy) => ({
  type: SET_IS_CREATE_NEW_STUDY,
  payload: isCreateNewStudy,
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
