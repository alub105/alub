import React, { useEffect, useState } from "react";
import { ChromeMessage, Sender, getCurrentTabUId, getCurrentTabUrl } from "./types";
import "./css/App.css";
import logo from "./image/logo.png";
import "./css/bootstrap.min.css";
import { REDIRECT_URI, CLIENT_ID, API_BASE_URL } from "./constant/index.js";

const App = () => {
  const [url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [authMode, setAuthMode] = useState(true);
  const [repoMode, setRepoMode] = useState(false);

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");

  const [commitChecked, setCommitChecked] = useState("CUSTOM");
  const [timerShown, setTimerShown] = useState(true);

  useEffect(() => {
    checkMode();
    getCurrentTabUrl((url) => {
      setUrl(url || "undefined");
    });
  }, []);

  const checkMode = () => {
    chrome.storage.sync.get("token", function (token) {
      if (Object.keys(token).length !== 0) {
        setAuthMode(false);
        const url = API_BASE_URL + "/api/user/configs";
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json;charset=UTF-8",
          },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              if (data.data.repoName === null) {
                setRepoMode(true);
              } else {
                setCommitChecked(data.data.commit);
                setTimerShown(data.data.timerShown);
              }
            });
          }
        });
      }
    });
  };

  // commit mode
  const handleCommit = (e: any) => {
    setCommitChecked(e.target.value);

    chrome.storage.sync.get("token", function (token) {
      const url = API_BASE_URL + "/api/user/configs";
      fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          commit: e.target.value,
        }),
      })
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    });
  };

  // timer shown
  const handleTimerShown = () => {
    setTimerShown((timerShown) => !timerShown);
    chrome.storage.sync.get("token", function (token) {
      const url = API_BASE_URL + "/api/user/configs";
      fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          timer: !timerShown,
        }),
      })
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const deleteToken = () => {
    chrome.storage.sync.remove("token", function () {
      setAuthMode(true);
    });
  };

  const setTimer = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: { data: { hh: hour, mm: minute, ss: second }, message: "setTimer" },
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setResponseFromContent(response);
        });
    });
  };
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "hour") {
      setHour(event.target.value);
    }
    if (event.target.id === "minute") {
      setMinute(event.target.value);
    }
    if (event.target.id === "second") {
      setSecond(event.target.value);
    }
  };

  // authenticate button click
  const gitLogin = () => {
    if (btnDisabled !== false) return;
    setBtnDisabled(true);
    const newUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    chrome.tabs.create({ url: newUrl });
  };

  const clickRepoSetting = () => {
    const welcome_url = `chrome-extension://${chrome.runtime.id}/welcome.html`;
    chrome.tabs.update({ url: welcome_url });
  };

  if (authMode) {
    return (
      <div className="app">
        <header>
          <div className="auth-header flex-row">
            <h2 className="title">ALUB</h2>
          </div>
        </header>
        <main>
          <div id="auth-mode" className="app-main">
            <div className="authenticate">
              <h4 className="middle-title">
                <span style={{ color: "#20c997" }}>ALUB</span>으로 백준, 프로그래머스에서 바로
                커밋하세요
              </h4>
              <hr className="hr" />
              <h4 className="middle-title">Authenticate with GitHub to use ALUB</h4>
              <button
                className="btn btn-lg btn-primary login-button"
                type="button"
                onClick={() => gitLogin()}
              >
                <i className="fab fa-github "></i>
                <span className="login-button-title">Authenticate</span>
              </button>
            </div>
            <div className="flex-row footer">
              <i className="fab fa-github "></i>
              <img className="logo" src={logo} alt={"logo"} />
            </div>
          </div>
        </main>
      </div>
    );
  } else if (repoMode) {
    return (
      <div className="app">
        <header>
          <div className="auth-header flex-row">
            <h2 className="title">ALUB</h2>
          </div>
        </header>
        <main>
          <div id="auth-mode" className="app-main">
            <div className="authenticate">
              <h4 className="middle-title">
                <span style={{ color: "#20c997" }}>ALUB</span>으로 백준, 프로그래머스에서 바로
                커밋하세요
              </h4>
              <hr className="hr" />
              <h4 className="middle-title">GitHub Repository를 설정하세요</h4>
              <button
                className="btn btn-lg btn-primary login-button"
                type="button"
                onClick={() => clickRepoSetting()}
              >
                <i className="fab fa-github "></i>
                <span className="login-button-title">Git Repository 설정</span>
              </button>
            </div>
            <div className="flex-row footer">
              <i className="fab fa-github "></i>
              <img className="logo" src={logo} alt={"logo"} />
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    return (
      <div className="app">
        <header className="commit-header flex-row">
          <img src={logo} alt={"logo"} className="logo" />
          <span>choieunsong</span>
          <span>/</span>
          <a href="#" id="git-repo-name" className="dir-name" target="_blank">
            TIL
          </a>
        </header>
        <main>
          <div id="commit-mode" className="app-main ">
            <div className="flex-column">
              <div className="commit-setting">
                <h4 className="middle-title">Commit 설정</h4>
                <form>
                  <fieldset className="form-group">
                    <div className="form-check form-grid">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="commit-setting"
                          id="default"
                          value="DEFAULT"
                          checked={commitChecked === "DEFAULT"}
                          onChange={handleCommit}
                        ></input>
                        Default
                      </label>
                      <span className="form-descript">
                        코드 제출 시 자동으로 새 파일로 저장됩니다
                      </span>
                    </div>
                    <div className="form-check form-grid">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="commit-setting"
                          id="custom"
                          value="CUSTOM"
                          checked={commitChecked === "CUSTOM"}
                          onChange={handleCommit}
                        ></input>
                        Custom
                      </label>
                      <span className="form-descript">
                        코드 제출 시 파일의 이름을 수정할 수 있으며, 덮어쓰기도 가능합니다
                      </span>
                    </div>
                  </fieldset>
                </form>
              </div>
              <hr className="hr" />
              <div className="timer-setting">
                <h4 className="middle-title">타이머 설정</h4>
                <form>
                  <div className="form-check form-switch flex-grid">
                    <label className="form-check-label" htmlFor="timer-show">
                      타이머 보이기
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="timer-show"
                      checked={timerShown}
                      onChange={handleTimerShown}
                    />
                  </div>
                  <div className="flex-row default-time-set">
                    <span className="timer-show-title">기본 시간 설정</span>
                    <div className="flex-row">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="hour"
                        placeholder="hh"
                        value={hour}
                        onChange={onChangeInput}
                      />
                      <span>:</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="minute"
                        placeholder="mm"
                        min="0"
                        max="60"
                        value={minute}
                        onChange={onChangeInput}
                      />
                      <span>:</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="second"
                        placeholder="ss"
                        min="0"
                        max="60"
                        value={second}
                        onChange={onChangeInput}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary timer-setting-button"
                        onClick={setTimer}
                      >
                        설정
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <hr className="hr" />
              <button
                className="btn btn-lg btn-primary"
                id="git-repo-button"
                type="button"
                onClick={() => deleteToken()}
              >
                <i className="fab fa-github "></i>
                <span className="login-button-title">Git Repository 설정</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default App;
