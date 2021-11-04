//access token이 있고 set github일 때 바로 welcome page로 이동
const start_url = "http://localhost:3000/oauth/redirect";
const api_url = "http://localhost:8080/api/user/authenticate";

function authListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    if (tab.url.startsWith(start_url)) {
      const param = tab.url.substring(tab.url.indexOf("?") + 1, tab.url.length | "undefined");

      const params = param.split("&");
      const platform = params[0].split("=");
      const code = params[1].split("=");

      if (platform[1] === "EXTENSION") {
        fetch(api_url, {
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
