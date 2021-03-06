//access token이 있고 set github일 때 바로 welcome page로 이동
let BASE_URL = "";
let START_URL = "";
let API_URL = "/api/user/authenticate";

function authListener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    if (tab.url.startsWith("http://localhost:3000")) {
      BASE_URL = "http://localhost:8080";
      START_URL = "http://localhost:3000/oauth/redirect";
      chrome.storage.sync.set({ mode: "dev" });
    } else if (tab.url.startsWith("https://alub.co.kr")) {
      chrome.storage.sync.set({ mode: "prod" });
      BASE_URL = "https://alub.co.kr";
      START_URL = "https://alub.co.kr/oauth/redirect";
    }

    if (START_URL !== "" && tab.url.startsWith(START_URL)) {
      const param = tab.url.substring(
        tab.url.indexOf("?") + 1,
        tab.url.length | "undefined"
      );

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
                chrome.storage.sync.set(
                  { token: data.data.token },
                  function () {
                    const welcome_url = `chrome-extension://${chrome.runtime.id}/welcome.html`;
                    chrome.tabs.update({ url: welcome_url });
                  }
                );
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

const boj = "https://www.acmicpc.net/";

function addStatusTable() {
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
        statusTable?.childNodes[1]?.childNodes[i]?.childNodes[3]?.childNodes[0]
          ?.textContent;
      const judging = statusTable?.childNodes[1]?.childNodes[i]?.childNodes[3]
        ?.querySelector("span")
        ?.classList.contains("result-judging");

      if (judging) {
        setTimeout(function () {
          addCommitButton(i);
        }, 2000);
      } else {
        if (
          statusTable?.childNodes[0]?.childNodes[0]?.childNodes?.length === 9
        ) {
          statusTable?.childNodes[0]?.childNodes[0]?.appendChild(commitColumn);
        } // column이 여러번 생성되지 않도록 제한.

        if (
          (result.includes("맞") || result.includes("100")) &&
          userId ===
            statusTable?.childNodes[1]?.childNodes[i]?.childNodes[1]
              ?.textContent
        ) {
          const answerNumber =
            statusTable?.childNodes[1]?.childNodes[i]?.childNodes[0]
              ?.textContent;
          let newButton = commitRow.cloneNode(true);
          const commitForm = document.createElement("form");
          commitForm.action = `https://acmicpc.net/source/${answerNumber}`;

          const commitButton = document.createElement("button");
          commitButton.addEventListener("click", function () {
            chrome.storage.sync.set({ commitNow: true }, () => {});
            commitButton.style.cssText = `box-shadow: 0 0 0 4px rgba(2,184,117,0.5);
            background-color: #18ad60;
            border-radius: 15px !important;
            font-size: 12px;
            color: #ffffff;
            cursor: pointer;`;
          });

          commitButton.innerHTML = "Commit";
          commitButton.setAttribute("class", "btn");

          commitButton.style.cssText = `
          background-color: #18ad60;
          border-radius: 15px !important;
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
          `;

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

function copyCode(
  BASE_URL,
  timerRunning,
  startHour,
  startMinute,
  startSecond,
  hour,
  minute,
  second
) {
  chrome.storage.sync.get("commitNow", function (response) {
    if (response.commitNow) {
      const userId = document.querySelector(".loginbar .username")?.innerHTML;
      const solvedUserId =
        document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]
          ?.childNodes[1]?.textContent;
      const resultTable = document.querySelector(".table-striped");
      const correct =
        (resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes(
          "맞"
        ) ||
          resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes(
            "100"
          )) &&
        userId === solvedUserId;
      const problemNumber =
        resultTable?.childNodes[1]?.childNodes[0]?.childNodes[2]?.textContent;
      const problemTitle =
        resultTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.textContent;
      const memory =
        resultTable?.childNodes[1]?.childNodes[0]?.childNodes[5]?.textContent;
      const timeConsumed =
        resultTable?.childNodes[1]?.childNodes[0]?.childNodes[6]?.textContent;
      const answerCode = document.getElementsByName("source")[0]?.innerText;
      let commitConfig = "";
      chrome.storage.sync.get("commitConfig", function (response) {
        if (Object.keys(response).length !== 0) {
          commitConfig = response.commitConfig;
        }
      });
      let codeLang = "";
      let site = "";
      const lang =
        document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]
          ?.childNodes[7]?.textContent;
      if (typeof lang === "string") {
        if (lang.includes("Py")) {
          codeLang = "py";
        }
        if (lang.includes("Java")) {
          codeLang = "java";
        }
        if (lang.includes("C")) {
          if (lang.includes("++")) {
            codeLang = "cpp";
          } else {
            codeLang = "c";
          }
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

      if (correct) {
        if (startSecond - second >= 0) {
          var consumedSecond = startSecond - second;
          if (startMinute - minute >= 0) {
            var consumedMinute = startMinute - minute;
            var consumedHour = startHour - hour;
          } else {
            var consumedMinute = startMinute - minute + 60;
            var consumedHour = startHour - hour - 1;
          }
        } else {
          var consumedSecond = startSecond - second + 60;
          if (startMinute - 1 - minute >= 0) {
            var consumedMinute = startMinute - 1 - minute;
            var consumedHour = startHour - hour;
          } else {
            var consumedMinute = startMinute - 1 - minute + 60;
            var consumedHour = startHour - hour - 1;
          }
        }
        chrome.storage.sync.get("token", function (token) {
          if (commitConfig === "DEFAULT") {
            if (timerRunning) {
              var spendTime = `${consumedHour}:${consumedMinute}:${consumedSecond}`;
            } else {
              var spendTime = null;
            }
            const data = {
              timer: spendTime,
              srcCode: answerCode,
              commit: commitConfig,
              language: codeLang,
              runningTime: timeConsumed,
              runningMemory: memory,
              problemTitle: problemTitle,
              problemNum: problemNumber,
              site: site,
            };
            chrome.storage.sync.remove([
              "leftHour",
              "leftMinute",
              "leftSecond",
              "timerRunning",
            ]);

            fetch(BASE_URL + "/api/user/commits", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token.token}`,
                "Content-Type": "application/json;charset=UTF-8",
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (response.ok) {
                  response.json().then((data) => {
                    const body = document.querySelector(".wrapper");
                    const element = `<div style=' position: fixed; top: 25px; right: 0; z-index: 100' id='alub-noti'>
                    <div
                      style='
                        width: 350px;
                        height: 130px;
                        display: flex;
                        flex-direction: column;
                        '
                        >
                        <div style=' background-color: #edf0f6; height: 30%; width: 100%; border-radius: 6px 6px 0 0 !important; padding: 5px; font-size: 20px;'>
                        <strong style='padding: 20px; color: #20c997;'>ALUB</strong>
                        </div>
                        <div
                        style='
                        background-color: rgba(0,0,0, 0.7);
                        height: 80%;
                        width: 100%;
                        font-size: 12px;
                        padding: 20px 15px;
                        margin: 0 auto;
                        text-align: center;
                        line-height: 24px;
                        color: white;
                        border-radius: 0 0 6px 6px !important;
                        '
                        
                      >
                        ${data.data.filePath}에 성공적으로 커밋을 완료하였습니다.
                      </div>
                    </div>
                  </div>`;
                    const template = document.createElement("div");
                    template.innerHTML = element;
                    body.appendChild(template);
                    setTimeout(() => {
                      document.querySelector("#alub-noti").remove();
                    }, 5000);
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            let repoName = "";
            chrome.storage.sync.get("repoName", function (response) {
              if (Object.keys(response).length !== 0) {
                repoName = response.repoName;
              }
              const inputModal = document.createElement("div");
              inputModal.setAttribute("class", "modal");
              inputModal.id = "inputModal";
              inputModal.style.width = "100%";
              inputModal.style.height = "100%";
              inputModal.style.backgroundColor = "rgba(0,0,0,0.7)";
              inputModal.style.display = "flex";
              inputModal.style.position = "fixed";
              inputModal.style.fontSize = "17px";
              inputModal.style.top = 0;
              inputModal.style.left = 0;
              inputModal.style.justifyContent = "center";
              inputModal.style.alignItems = "center";

              const element = `<div style=' position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100' id='alub-input'>

                  <div
                  style='
                  width: 450px;
                  height: 273px;
                  display: flex;
                  flex-direction: column;
                  '
                  >

                    <div style=' background-color: #edf0f6; height: 60px; width: 450px; border-radius: 6px 6px 0 0 !important; padding: 15px 20px; font-size: 20px;'>
                        <strong style='color: #20c997;'>ALUB</strong>
                    </div>

                    <div
                    style='
                    background-color: rgba(0,0,0, 0.7);
                    height: 80%;
                    width: 100%;
                    font-size: 17px;
                    padding: 15px 20px;
                    margin: 0 auto;
                    text-align: center;
                    line-height: 24px;
                    color: white;
                    border-radius: 0 0 6px 6px !important;
                    '

                    >
                      <div style="width: 100%; height: 100%; text-align: 'center' display: flex; flex-direction: column;">
                          <div>
                              <span style="font-size: 17px;">repo 위치:</span>
                              <span>${repoName}/${site}/${problemNumber}</span>
                          </div>
                          <form class="form-group" style="margin-top: 25px; display: flex; flex-direction: row; gap: 10px; height: 30px; align-items: center; justify-content: center">
                              <label class="form-label">파일명: </label>
                              <input type="text" class="form-control" style="width: 65%; padding: 10px 5px;" id="fileNameInput" minlength="2"></input>
                              <span style="font-size: 21px;">.${codeLang}</span>
                          </form>
                          <button style="margin-top: 25px; padding: 6px 15px; border-radius: 10px; border: none; font-size: 17px; background-color: #18ad60; color: #ffffff; cursor: pointer;" type="button" id="button">Commit</button>
                      </div>
                    </div>
                  </div>
                </div>`;
              const template = document.createElement("div");
              template.innerHTML = element;
              inputModal.appendChild(template);
              document
                .querySelector(".container.content")
                ?.appendChild(inputModal);
              template
                .querySelector("button")
                .addEventListener("click", function submitCommitData(event) {
                  event.preventDefault();
                  chrome.storage.sync.set({ commitNow: false }, () => {});
                  let fileName = fileNameInput.value;
                  if (timerRunning) {
                    var spendTime = `${consumedHour}:${consumedMinute}:${consumedSecond}`;
                  } else {
                    var spendTime = null;
                  }
                  const data = {
                    timer: spendTime,
                    srcCode: answerCode,
                    commit: commitConfig,
                    language: codeLang,
                    fileName: fileName,
                    runningTime: timeConsumed,
                    runningMemory: memory,
                    problemTitle: problemTitle,
                    problemNum: problemNumber,
                    site: site,
                  };
                  chrome.storage.sync.remove([
                    "leftHour",
                    "leftMinute",
                    "leftSecond",
                    "timerRunning",
                  ]);

                  fetch(BASE_URL + "/api/user/commits", {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token.token}`,
                      "Content-Type": "application/json;charset=UTF-8",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => {
                      if (response.ok) {
                        response.json().then((data) => {
                          document.getElementById("inputModal").remove();
                          const body = document.querySelector(".wrapper");
                          const element = `<div style=' position: fixed; top: 25px; right: 0; z-index: 100' id='alub-noti'>
                      <div
                        style='
                          width: 350px;
                          height: 130px;
                          display: flex;
                          flex-direction: column;
                          '
                          >
                          <div style=' background-color: #edf0f6; height: 30%; width: 100%; border-radius: 6px 6px 0 0 !important; padding: 5px; font-size: 20px;'>
                          <strong style='padding: 20px; color: #20c997;'>ALUB</strong>
                          </div>
                          <div
                          style='
                          background-color: rgba(0,0,0, 0.7);
                          height: 80%;
                          width: 100%;
                          font-size: 12px;
                          padding: 20px 15px;
                          margin: 0 auto;
                          text-align: center;
                          line-height: 24px;
                          color: white;
                          border-radius: 0 0 6px 6px !important;
                          '
                          
                        >
                          ${data.data.filePath}에 성공적으로 커밋을 완료하였습니다.
                        </div>
                      </div>
                    </div>`;
                          const template = document.createElement("div");
                          template.innerHTML = element;
                          body.appendChild(template);
                          setTimeout(() => {
                            document.querySelector("#alub-noti").remove();
                          }, 5000);
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
            });
          }
        });
      }
    }
  });
}

// timer만드는 부분

function createTimer(h, m, s, timerRunning, timerPause) {
  const component = document.createElement("div");
  component.id = "component";
  component.style.cssText = `
    width: 240px;
    height: 140px;
    display: flex;
    flex-direction: column;
    position: fixed; top: 19rem; right:11rem;
    z-index: 100 !important;'
    `;
  const componentHeader = document.createElement("div");
  componentHeader.id = "componentHeader";
  componentHeader.style.cssText = `
    background-color: rgba(29,41,55,0.8);
    height: 40px; width: 100%;
    border-radius: 6px 6px 0 0 !important;
    padding: 0 20px;
    font-size: 19px;
    text-align:center;
    color: #20c997;
    cursor: grab;
    `;
  componentHeader.innerHTML = `<strong style="line-height: 40px;">TIMER</strong>`;
  component.appendChild(componentHeader);

  const timerWrapper = document.createElement("div");
  timerWrapper.style.cssText = `
    background-color: rgba(29,41,55,0.8);
    height: 100px;
    width: 100%;
    padding: 3px 20px 15px 20px;
    margin: 0 auto;
    text-align: center;
    color: white;
    justify-content: start;
    border-radius: 0 0 6px 6px !important;
    `;
  component.appendChild(timerWrapper);

  const timeComponent = document.createElement("div");
  timeComponent.style.cssText = `
    display: flex; flex-direction: row; gap: 9px; margin: 3px 0 11px 0; justify-content: center; font-size: 25px; 
    `;

  timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 15px;">:</span>
      <span style="font-size: 15px;" id="minute">${strMinute}<span>
      <span style="font-size: 15px;">:</span>
      <span style="font-size: 15px;" id="second">${strSecond}</span>`;

  timerWrapper.appendChild(timeComponent);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.cssText = `display: flex; flex-direction: row; gap: 9px; margin-top: 15px; justify-content: center; height: 30px;`;

  const startPauseButton = document.createElement("button");
  startPauseButton.setAttribute("style", "border-radius: 15px !important;");
  startPauseButton.innerText = timerPause ? "시작" : "일시정지";
  startPauseButton.style.backgroundColor = timerPause ? "#18ad60" : "#ce3c3e";
  startPauseButton.style.padding = "3px 12px";
  startPauseButton.style.width = "77px";
  // startPauseButton.style.borderradius = "15px !important";
  startPauseButton.style.border = "none";
  startPauseButton.style.fontSize = "13px";
  startPauseButton.style.color = "white";
  startPauseButton.style.cursor = "pointer";

  buttonWrapper.appendChild(startPauseButton);

  const stopButton = document.createElement("button");
  stopButton.innerText = "초기화";
  stopButton.style.cssText = `
  padding: 3px 12px; width: 77px; border-radius: 15px !important; border: none; font-size: 13px; background-color: #ea9e3e; color: #ffffff; cursor: pointer;
  `;
  buttonWrapper.appendChild(stopButton);
  timerWrapper.appendChild(buttonWrapper);

  startPauseButton.addEventListener("click", startPauseTimer);
  stopButton.addEventListener("click", reset);

  var startHour,
    startMinute,
    startSecond = 0;
  chrome.storage.sync.get("hour", (response) => {
    startHour = parseInt(response.hour);
  });
  chrome.storage.sync.get("minute", (response) => {
    startMinute = parseInt(response.minute);
  });
  chrome.storage.sync.get("second", (response) => {
    startSecond = parseInt(response.second);
  });

  // component.appendChild(startPauseButton);

  // component.appendChild(stopButton);
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var isStop = false;
  var autotimerSwitch = false;

  var strHour = String(h).padStart(2, "0");
  var strMinute = String(m).padStart(2, "0");
  var strSecond = String(s).padStart(2, "0");
  timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${strMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${strSecond}</span>`;
  if (timerRunning) {
    let autotimer = setInterval(() => {
      if (!isStop) {
        autotimerSwitch = true;
        if (!timerPause) {
          if (s > 0) {
            s = s - 1;
          }
          if (s === 0) {
            if (m === 0) {
              if (h === 0) {
                clearInterval(autotimer);
                autotimerSwitch = false;
                chrome.storage.sync.set({ timerPause: true });
              } else {
                h = h - 1;
                m = 59;
                s = 60;
              }
            } else {
              m = m - 1;
              s = 60;
            }
          }
          chrome.storage.sync.set(
            { leftHour: h, leftMinute: m, leftSecond: s },
            () => {
              strHour = String(h).padStart(2, "0");
              strMinute = String(m).padStart(2, "0");
              strSecond = String(s).padStart(2, "0");
              timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${strMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${strSecond}</span>`;
            }
          );
        } else {
          clearInterval(autotimer);
          chrome.storage.sync.set(
            { leftHour: h, leftMinute: m, leftSecond: s },
            () => {
              strHour = String(h).padStart(2, "0");
              strMinute = String(m).padStart(2, "0");
              strSecond = String(s).padStart(2, "0");
              timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${strMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${strSecond}</span>`;
            }
          );
        }
      } else {
        clearInterval(autotimer);
      }
    }, 1000);
  }

  function startPauseTimer() {
    chrome.storage.sync.set({ timerRunning: true });
    if (!timerPause) {
      timerPause = true;
      startPauseButton.style.backgroundColor = "#02b875";
      timerRunning = false;
      chrome.storage.sync.set({ timerPause: true });
      startPauseButton.innerText = "시작";
    } else {
      timerRunning = true;
      startPauseButton.style.backgroundColor = "#d9534f";
      timerPause = false;
      isStop = false;
      chrome.storage.sync.set({ timerPause: false }, () => {});
      startPauseButton.innerText = "일시정지";
    }
    if (timerRunning) {
      let autotimer = setInterval(() => {
        if (!isStop) {
          if (!timerPause) {
            if (s > 0) {
              s = s - 1;
            }
            if (s === 0) {
              if (m === 0) {
                if (h === 0) {
                  clearInterval(autotimer);
                  chrome.storage.sync.set({ timerPause: true });
                } else {
                  h = h - 1;
                  m = 59;
                  s = 59;
                }
              } else {
                m = m - 1;
                s = 59;
              }
            }
            chrome.storage.sync.set(
              { leftHour: h, leftMinute: m, leftSecond: s },
              () => {
                strHour = String(h).padStart(2, "0");
                strMinute = String(m).padStart(2, "0");
                strSecond = String(s).padStart(2, "0");
                timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${strMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${strSecond}</span>`;
              }
            );
          } else {
            clearInterval(autotimer);
            chrome.storage.sync.set(
              { leftHour: h, leftMinute: m, leftSecond: s },
              () => {
                let strHour = String(h).padStart(2, "0");
                let strMinute = String(m).padStart(2, "0");
                let strSecond = String(s).padStart(2, "0");
                timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${strHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${strMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${strSecond}</span>`;
              }
            );
          }
        } else {
          clearInterval(autotimer);
        }
      }, 1000);
    }
  }
  function reset() {
    startPauseButton.innerText = "시작";
    startPauseButton.style.backgroundColor = "#18ad60";
    timerPause = true;
    timerRunning = false;
    isStop = true;
    autotimerSwitch = false;
    chrome.storage.sync.remove(
      ["leftHour", "leftMinute", "leftSecond", "timerRunning"],
      () => {
        h = startHour;
        m = startMinute;
        s = startSecond;
        let firstHour = String(h).padStart(2, "0");
        let firstMinute = String(m).padStart(2, "0");
        let firstSecond = String(s).padStart(2, "0");
        timeComponent.innerHTML = `  <span style="font-size: 25px; id="hour">${firstHour}</span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="minute">${firstMinute}<span>
      <span style="font-size: 25px;">:</span>
      <span style="font-size: 25px;" id="second">${firstSecond}</span>`;
      }
    );
  }
  // scroll할때 스크롤 하는만큼 타이머 위치 변화
  // chrome.storage.sync.set({ scrollY: 0 });
  // window.onscroll = function () {
  //   var diffY = window.scrollY;
  //   var presentY = parseInt(component.style.top.replace("px", ""));
  //   chrome.storage.sync.get("scrollY", (response) => {
  //     if (Object.keys(response).length !== 0) {
  //       if (diffY > response.scrollY) {
  //         component.style.top = `${presentY + diffY - response.scrollY}px`;
  //       } else {
  //         component.style.top = `${presentY + diffY - response.scrollY}px`;
  //       }
  //       chrome.storage.sync.set({ scrollY: diffY });
  //     }
  //   });
  // };

  // header를 잡고 드래그하면 위치를 변화시키게하는 함수
  componentHeader.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    component.style.top = component.offsetTop - pos2 + "px";
    component.style.left = component.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
  // 맞았습니다가 나올경우 stop시키는 함수
  const statusTable = document.getElementById("status-table");
  const userId = document.querySelector(".loginbar .username")?.innerHTML;
  const result =
    statusTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.childNodes[0]
      ?.textContent;

  function correctPause() {
    const judging = statusTable?.childNodes[1]?.childNodes[0]?.childNodes[3]
      ?.querySelector("span")
      ?.classList.contains("result-judging");
    if (!judging) {
      // console.log("채점끝")
      if (
        (result?.includes("맞") || result?.includes("100")) &&
        userId ===
          statusTable?.childNodes[1]?.childNodes[0]?.childNodes[1]?.textContent
      ) {
        // console.log("내가 푼 문제가 맞네")
        timerPause = true;
        startPauseButton.style.backgroundColor = "green";
        timerRunning = false;
        chrome.storage.sync.set({ timerPause: true });
        startPauseButton.innerText = "시작";
      }
    }
  }
  window.onload = correctPause();

  document.querySelector(".container.content")?.appendChild(component);
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const currentUrl = tab.url;

    var timerRunning = false;
    chrome.storage.sync.get("timerRunning", (response) => {
      if (Object.keys(response).length !== 0) {
        timerRunning = response.timerRunning;
      }
    });
    // 백준에서
    if (currentUrl.startsWith(boj)) {
      var startHour = 0,
        startMinute = 0,
        startSecond = 0,
        hour = 0,
        minute = 0,
        second = 0;
      var timerPause = true;
      chrome.storage.sync.get("hour", (response) => {
        startHour = parseInt(response.hour);
      });
      chrome.storage.sync.get("minute", (response) => {
        startMinute = parseInt(response.minute);
      });
      chrome.storage.sync.get("second", (response) => {
        startSecond = parseInt(response.second);
      });
      chrome.storage.sync.get("timerPause", (response) => {
        if (Object.keys(response).length !== 0) {
          timerPause = response.timerPause;
        }
      });

      chrome.storage.sync.get("leftHour", (response) => {
        if (Object.keys(response).length !== 0) {
          hour = parseInt(response.leftHour);
        } else {
          chrome.storage.sync.get("hour", (response) => {
            hour = parseInt(response.hour);
          });
        }
      });
      chrome.storage.sync.get("leftMinute", (response) => {
        if (Object.keys(response).length !== 0) {
          minute = parseInt(response.leftMinute);
        } else {
          chrome.storage.sync.get("minute", (response) => {
            minute = parseInt(response.minute);
          });
        }
      });
      chrome.storage.sync.get("leftSecond", (response) => {
        if (Object.keys(response).length !== 0) {
          second = parseInt(response.leftSecond);
        } else {
          chrome.storage.sync.get("second", (response) => {
            second = parseInt(response.second);
          });
        }
      });
      chrome.storage.sync.get("mode", function (response) {
        if (response.mode === "dev") {
          BASE_URL = "http://localhost:8080";
        }
        if (response.mode === "prod") {
          BASE_URL = "https://alub.co.kr";
        }
      });
      await chrome.storage.sync.get("token", function (response) {
        if (Object.keys(response).length !== 0) {
          // userconfig 자동으로 가져옴.
          let url = BASE_URL + "/api/user/configs";
          fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${response.token}`,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }).then((response) => {
            if (response.ok) {
              response.json().then((data) => {
                if (data.data.repoName === null) {
                  setRepoMode(true);
                } else {
                  // commit mode setting
                  //timer shown setting
                  chrome.storage.sync.set(
                    {
                      timerShown: data.data.timerShown,
                      repoName: data.data.repoName,
                      commitConfig: data.data.commit,
                    },
                    function () {}
                  );
                  // 타이머 setting
                  let time = data.data.timerDefaultTime.split(":");
                  chrome.storage.sync.set(
                    { hour: time[0], minute: time[1], second: time[2] },
                    function () {}
                  );
                }
              });
            }
          });

          if (
            currentUrl.includes("acmicpc.net/problem") ||
            currentUrl.includes("submit") ||
            currentUrl.includes("status")
          ) {
            chrome.storage.sync.get("timerShown", function (response) {
              if (Object.keys(response).length !== 0 && response.timerShown) {
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: createTimer,
                  args: [hour, minute, second, timerRunning, timerPause],
                });
              }
            });
          }

          // 제출현황판에서는 commit하는것 초기화 + commit버튼추가
          if (currentUrl.includes("status")) {
            chrome.storage.sync.set({ commitNow: false }, () => {});
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: addStatusTable,
            });
          }

          // 소스코드페이지에서는 copycode 함수 실행
          if (currentUrl.includes("source")) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: copyCode,
              args: [
                BASE_URL,
                timerRunning,
                startHour,
                startMinute,
                startSecond,
                hour,
                minute,
                second,
              ],
            });
          }
        }
      });
    }
  }
});
