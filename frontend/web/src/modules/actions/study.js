export const SET_SELECTED_CHANNEL = "study/SET_SELECTED_CHANNEL";

export const SET_CHANNEL_LIST = "study/SET_CHANNEL_LIST";

export const DELETE_CHANNEL = "study/DELETE_CHANNEL";

export const UPDATE_CHANNEL = "study/UPDATE_CHANNEL";

// -1: profile, -2: home
export const setSelectedChannel = (id) => ({
  type: SET_SELECTED_CHANNEL,
  payload: id,
});

export const setChannelList = (channelInfo) => ({
  type: SET_CHANNEL_LIST,
  payload: channelInfo,
});

export const deleteChannel = (id) => ({
  type: DELETE_CHANNEL,
  payload: id,
});

export const updateChannel = (channelInfo) => ({
  type: UPDATE_CHANNEL,
  payload: channelInfo,
});
