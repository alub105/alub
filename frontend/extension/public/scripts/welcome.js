// const token = chrome.storage.sync.get("token", function (token) {
//   console.log("token", token);
// });

// const base_url = "http://localhost:8080/api/user/";

// $(document).ready(function () {
//   // 기존 repo 목록 가져오기
//   const get_repo_url = base_url + "repos";

//   fetch(get_repo_url, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json;charset=UTF-8",
//     },
//   })
//     .then((response) => {
//       console.log("response");
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log("error");
//       console.log(error);
//     });
// });
