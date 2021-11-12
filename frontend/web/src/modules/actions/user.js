export const SET_TOKEN = "user/SET_TOKEN";

//액션 함수
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});
