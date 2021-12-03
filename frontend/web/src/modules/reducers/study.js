import * as studyActions from "../actions/study";

const initialState = {
  channelList: [],
  isCreateNewStudy: false,
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case studyActions.SET_CHANNEL_LIST:
      return {
        channelList: [...action.payload],
        selectedChannel: action.payload.id,
      };
    case studyActions.SET_IS_CREATE_NEW_STUDY:
      return {
        ...state,
        isCreateNewStudy: !state.isCreateNewStudy,
      };
    case studyActions.UPDATE_CHANNEL_LIST:
      return {
        channelList: state.channelList.concat(action.payload),
        selectedChannel: action.payload.id,
      };
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
        channelList: state.channelList.filter(
          (channel) => channel.id !== Number(action.payload)
        ),
      };

    default:
      return state;
  }
};

export default reducers;
