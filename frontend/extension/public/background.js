//access token이 있고 set github일 때 바로 welcome page로 이동
let BASE_URL = "";
let START_URL = "";
let API_URL = "/api/user/authenticate";

function authListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log(tab.url);

    if (tab.url.startsWith("http://localhost:3000")) {
      BASE_URL = "http://localhost:8080";
      START_URL = "http://localhost:3000/oauth/redirect";
      chrome.storage.sync.set({ mode: "dev" });
    } else if (tab.url.startsWith("https://alub.co.kr")) {
      chrome.storage.sync.set({ mode: "prod" });
      BASE_URL = "https://alub.co.kr";
      START_URL = "https://alub.co.kr/oauth/redirect";
    }

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

// const boj = "https://www.acmicpc.net/";

const boj = "https://www.acmicpc.net/";

function addStatusTable() {
  console.log("status 테이블 추가 시작");

  const userId = document.querySelector(".loginbar .username")?.innerHTML;
  // loginID와 푼사람의 ID가 같은지 확인하기 위해서 특정함.
  const statusTable = document.getElementById("status-table");

  const commitColumn = document.createElement("th");
  commitColumn.innerHTML = "Commit";
  // commit header 추가
  const commitRow = document.createElement("td");

  var tableLength = statusTable?.childNodes[1]?.childNodes?.length;
  if (typeof tableLength === "number") {
    var i = tableLength - 1;
    function addCommitButton(i) {
      if (i < 0) return;
      const result =
        statusTable?.childNodes[1]?.childNodes[i]?.childNodes[3]?.childNodes[0]?.textContent;
      const judging = statusTable?.childNodes[1]?.childNodes[i]?.childNodes[3]
        ?.querySelector("span")
        ?.classList.contains("result-judging");
      console.log(i + "번째 채점중", judging);
      if (judging) {
        setTimeout(function () {
          addCommitButton(i);
        }, 2000);
      } else {
        if (statusTable?.childNodes[0]?.childNodes[0]?.childNodes?.length === 9) {
          statusTable?.childNodes[0]?.childNodes[0]?.appendChild(commitColumn);
        } // column이 여러번 생성되지 않도록 제한.

        if (
          (result.includes("맞") || result.includes("100")) &&
          userId === statusTable?.childNodes[1]?.childNodes[i]?.childNodes[1]?.textContent
        ) {
          const answerNumber =
            statusTable?.childNodes[1]?.childNodes[i]?.childNodes[0]?.textContent;
          let newButton = commitRow.cloneNode(true);
          const commitForm = document.createElement("form");
          commitForm.action = `https://acmicpc.net/source/${answerNumber}`;
          const commitButton = document.createElement("button");
          commitButton.innerHTML = "Commit";
          commitButton.setAttribute("class", "btn");
          commitForm.append(commitButton);
          // commit하는 버튼을 row에 알맞게 추가.
          newButton.appendChild(commitForm);

          // appending same element over and over하면 1개만 추가됨 => for문이 실행될때 마다 cloneNode를 통해서 새로운 node를 추가해야 정상적으로 실행.
          statusTable?.childNodes[1]?.childNodes[i]?.appendChild(newButton);
        } else {
          let newButton = commitRow.cloneNode(false);
          // cloneNode(false)의 경우 세부내용 전부 지워짐.
          // 칸 만들어주는 용 추가.
          statusTable?.childNodes[1]?.childNodes[i]?.appendChild(newButton);
        }
        i--;
        addCommitButton(i);
      }
    }
    window.onload = addCommitButton(i);
  }
}

function copyCode(BASE_URL) {
  const userId = document.querySelector(".loginbar .username")?.innerHTML;
  const solvedUserId =
    document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]?.childNodes[1]
      ?.textContent;
  const resultTable = document.querySelector(".table-striped");
  const correct =
    (resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes(
      "맞"
    ) ||
      resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes(
        "100"
      )) &&
    userId === solvedUserId;
  const problemNumber = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[2]?.textContent;
  const problemName = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.textContent;
  const memory = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[5]?.textContent;
  const timeConsumed = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[6]?.textContent;
  const answerCode = document.getElementsByName("source")[0]?.innerText;

  let codeLang = "";
  let site = "";
  const lang =
    document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]?.childNodes[7]
      ?.textContent;
  if (typeof lang === "string") {
    if (lang.includes("Py")) {
      codeLang = "py";
    }
    if (lang.includes("Java")) {
      codeLang = "java";
    }
    if (lang.includes("C")) {
      codeLang = "C";
    }
    if (lang.includes("Ruby")) {
      codeLang = "rbw";
    }
    if (lang.includes("Rust")) {
      codeLang = "rs";
    }
    if (lang.includes("Go")) {
      codeLang = "go";
    }
    if (lang.includes("node")) {
      codeLang = "js";
    }
    if (lang.includes("Text")) {
      codeLang = "txt";
    }
    if (lang.includes("Swift")) {
      codeLang = "swift";
    }
  }
  const url = window.location.href;
  if (url.includes("acmicpc.net")) {
    site = "BOJ";
  }
  if (url.includes("programmers")) {
    site = "PROGRAMMERS";
  }
  chrome.storage.sync.get("mode", function (mode) {
    console.log(mode.mode);
    if (mode.mode === "dev") {
      BASE_URL = "http://localhost:8080";
    } else if (mode.mode === "prod") {
      BASE_URL = "https://alub.co.kr";
    }
    console.log(BASE_URL);
  });

  chrome.storage.sync.get("token", function (token) {
    const data = {
      srcCode: answerCode,
      commit: "DEFAULT",
      language: codeLang,
      runningTime: timeConsumed,
      runningMemory: memory,
      problemName: problemName,
      problemNum: problemNumber,
      site: site,
    };

    if (correct) {
      fetch(BASE_URL + "/api/user/commits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const currentUrl = tab.url;
    // 백준에서
    if (currentUrl.startsWith(boj)) {
      await chrome.storage.sync.get("token", function (response) {
        if (Object.keys(response).length !== 0) {
          if (currentUrl.includes("status")) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: addStatusTable,
            });
          }
          if (currentUrl.includes("source")) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: copyCode,
              args: [BASE_URL],
            });
          }
        }
      });
    }
  }
});
