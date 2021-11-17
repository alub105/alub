export const SET_TOKEN = "user/SET_TOKEN";

export const SET_USER_INFO = "user/SET_USER_INFO";

//액션 함수
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});
