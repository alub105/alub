/* eslint-disable */
import { API_BASE_URL } from "../../config/index";

// 사용자 정보 가져오기
export const getUserInfo = async (token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + "/api/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 채널 리스트 가져오기
export const getChannelList = async (token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + "/api/channels/mychannels", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 스터디 info 가져오기
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

// 스터디 리스트 가져오기
export const getStudyList = async (channelId, token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/channels/${channelId}/studies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getStudyDetail = async (channelId, studyId, token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/channels/${channelId}/studies/${studyId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getMembers = async (channelId, token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/channels/${channelId}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const searchMember = async (memberName, token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + "/api/users/searches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        terms: {
          name: memberName,
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateChannel = (
  name,
  hostId,
  deletedMember,
  addedMember,
  token
) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/channels/${token}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: name,
        hostId: hostId,
        deletedMember: deletedMember,
        addedMember: addedMember,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// repo setting
export const getUserConfig = (token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/user/configs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// repo setting
export const getUserRepos = (token) => {
  return new Promise(function(resolve, reject) {
    fetch(API_BASE_URL + `/api/user/repos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
