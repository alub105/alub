import { API_BASE_URL } from "../../config/index";

export const getStudyInfo = async (channelId, token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/channels/${channelId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // console.log(data);
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
