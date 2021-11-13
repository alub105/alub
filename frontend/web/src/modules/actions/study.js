export const SET_SELECTED_CHANNEL = "study/SET_SELECTED_CHANNEL";

export const SET_CHANNEL_LIST = "study/SET_CHANNEL_LIST";

// 0: home, -1: new
export const setSelectedChannel = (id) => ({
  type: SET_SELECTED_CHANNEL,
  payload: id,
});

export const setChannelList = (channelInfo) => ({
  type: SET_CHANNEL_LIST,
  payload: channelInfo,
});
