const SET_TOKEN = "SET_TOKEN";

//액션 함수
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

// 초기값
const userState = {
  token: "",
};

export default function userReducer(state = userState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return (state.token = action.payload);
    default:
      return state;
  }
}
