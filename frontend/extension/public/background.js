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
                console.log(data);
                chrome.storage.sync.set({ token: data.data.token }, function () {
                  console.log("저장 되었습니다");
                  chrome.storage.sync.get("token", function (data) {
                    console.log("token: ", data);
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
