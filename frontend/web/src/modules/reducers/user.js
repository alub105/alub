import * as userActions from "../actions/user";

// 초기값
const initialStates = {
  token: "",
};

const reducers = (state = initialStates, action) => {
  switch (action.type) {
    case userActions.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
