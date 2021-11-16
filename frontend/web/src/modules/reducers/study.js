import * as studyActions from "../actions/study";

const initialState = {
  selectedChannel: -1, //선택한 채널 id
  channelList: [],
};

const reducers = (state = initialState, action) => {
  if (action.type === studyActions.DELETE_CHANNEL) {
    console.log(action.payload);
  }
  switch (action.type) {
    case studyActions.SET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      };
    case studyActions.SET_CHANNEL_LIST:
      if (!state.channelList.find((channel) => Number(action.payload.id) === channel.id)) {
        return {
          channelList: state.channelList.concat(action.payload),
          selectedChannel: action.payload.id,
        };
      } else {
        return {
          ...state,
        };
      }
    case studyActions.UPDATE_CHANNEL:
      return {
        ...state,
        channelList: state.channelList.map((content) =>
          content.id === Number(action.payload.id)
            ? { ...content, name: action.payload.name }
            : content
        ),
      };
    case studyActions.DELETE_CHANNEL:
      return {
        ...state,
        channelList: state.channelList.filter((channel) => channel.id !== Number(action.payload)),
      };

    default:
      return state;
  }
};

export default reducers;
