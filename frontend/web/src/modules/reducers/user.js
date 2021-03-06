import * as userActions from "../actions/user";

// 초기값
const initialStates = {
  token: "",
  userInfo: {
    userId: "",
    name: "",
    email: "",
    imageUrl: "",
  },
};

const reducers = (state = initialStates, action) => {
  switch (action.type) {
    case userActions.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case userActions.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
