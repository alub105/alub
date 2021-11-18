import * as studyActions from "../actions/study";

const initialState = {
  selectedChannel: 0, //선택한 채널 id
  channelList: [],
  runningStudyList: [],
  endedStudyList: [],
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
        channelList: [...action.payload],
        selectedChannel: action.payload.id,
      };
    case studyActions.UPDATE_CHANNEL_LIST:
      return {
        // ...state,
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
    case studyActions.SET_RUNNING_STUDY_LIST:
      return {
        ...state,
        runningStudyList: [...action.payload],
      };
    case studyActions.SET_ENDED_STUDY_LIST:
      return {
        ...state,
        endedStudyList: [...action.payload],
      };
    case studyActions.ADD_RUNNING_STUDY_LIST:
      return {
        ...state,
        runningStudyList: state.runningStudyList?.concat(action.payload),
      };
    default:
      return state;
  }
};

export default reducers;
