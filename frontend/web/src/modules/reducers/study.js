import * as studyActions from "../actions/study";

const initialState = {
  selectedChannel: -1,
  channelList: [],
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case studyActions.SET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      };
    case studyActions.SET_CHANNEL_LIST:
      if (!state.channelList.find((channel) => action.payload.id === channel.id)) {
        return {
          channelList: state.channelList.concat(action.payload),
          selectedChannel: action.payload.id,
        };
      }
    default:
      return state;
  }
};

export default reducers;
