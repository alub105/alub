import * as studyActions from "../actions/study";

const initialState = {
  selectedChannel: -1, //선택한 채널 id
  channelList: [],
  studyInfo: {},
};

const reducers = (state = initialState, action) => {
  console.log(action.payload);
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

    case studyActions.SET_STUDY_INFO:
      return {
        ...state,
        studyInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
