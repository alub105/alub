import * as studyActions from "../actions/study";

const initialState = {
  selectedChannel: -1,
  channelList: [
    {
      id: 10,
      name: "alub",
    },
  ],
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case studyActions.SET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      };
    case studyActions.SET_CHANNEL_LIST:
      return {
        channelList: state.channelList.concat(action.payload),
        selectedChannel: action.payload.id,
      };
    default:
      return state;
  }
};

export default reducers;
