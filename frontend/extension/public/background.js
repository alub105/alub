//access token이 있고 set github일 때 바로 welcome page로 이동

var BASE_URL = "";
var START_URL = "";
var API_URL = "/api/user/authenticate";

chrome.management.get(chrome.runtime.id, function (data) {
  // console.log(data);
  if (data.installType === "development") {
    BASE_URL = "http://localhost:8080";
    START_URL = "http://localhost:3000/oauth/redirect";
  } else {
    BASE_URL = "https://alub.co.kr";
    START_URL = "https://alub.co.kr/oauth/redirect";
  }
  // console.log("BASE_URL", BASE_URL);
});

function authListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    if (tab.url.startsWith(START_URL)) {
      const param = tab.url.substring(tab.url.indexOf("?") + 1, tab.url.length | "undefined");

      const params = param.split("&");
      const platform = params[0].split("=");
      const code = params[1].split("=");

      if (platform[1] === "EXTENSION") {
        fetch(BASE_URL + API_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            code: code[1],
            platform: platform[1],
          }),
        })
          .then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                chrome.storage.sync.set({ token: data.data.token }, function () {
                  chrome.storage.sync.get("token", function (token) {
                    const welcome_url = `chrome-extension://${chrome.runtime.id}/welcome.html`;
                    chrome.tabs.update({ url: welcome_url });
                  });
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }
}

chrome.tabs.onUpdated.addListener(authListener);


const boj = "https://www.acmicpc.net/"

function reportback(domcontent){
  console.log(domcontent+"complete")
}

function completeListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    const currentUrl = tab.url
    // 백준에서
    if (currentUrl.startsWith(boj)) {
        if (currentUrl.includes("status")){
          console.log("백준 현황판 도착은했음")

          chrome.tabs.sendMessage(tabId, {message: "add status table"}, reportback)
        }
      }
    }
  }



chrome.tabs.onUpdated.addListener(completeListener);
