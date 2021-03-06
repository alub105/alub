import React, { useEffect, useState } from "react";
import {
  ChromeMessage,
  Sender,
  getCurrentTabUId,
  getCurrentTabUrl,
} from "./types";
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

  const [token, setToken] = useState(true);
  const [repoName, setRepoName] = useState("");
  const [userName, setUserName] = useState("");
  const [gitUrl, setGitUrl] = useState("");

  useEffect(() => {
    checkMode();
    getCurrentTabUrl((url) => {
      setUrl(url || "undefined");
    });
  }, []);

  const checkMode = () => {
    chrome.storage.sync.get("token", function (token) {
      if (Object.keys(token).length !== 0) {
        setToken(token.token);

        setAuthMode(false);
        let url = API_BASE_URL + "/api/user/configs";
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json;charset=UTF-8",
          },
        }).then((response) => {
          if (response.ok) {
            console.log(response);
            response.json().then((data) => {
              if (data.data.repoName === null) {
                setRepoMode(true);
              } else {
                // commit mode setting
                setCommitChecked(data.data.commit);
                //timer shown setting
                setTimerShown(data.data.timerShown);
                chrome.storage.sync.set(
                  {
                    timerShown: data.data.timershown,
                    repoName: data.data.repoName,
                    commitConfig: data.data.commit,
                  },
                  function () {}
                );
                // ????????? setting
                let time = data.data.timerDefaultTime.split(":");
                setHour(time[0]);
                setMinute(time[1]);
                setSecond(time[2]);
                chrome.storage.sync.set(
                  { hour: time[0], minute: time[1], second: time[2] },
                  function () {}
                );

                setRepoName(data.data.repoName);
                setInitialInfo(data.data.repoName);
              }
            });
          } else {
            deleteToken();
          }
        });
      }
    });
  };

  const setInitialInfo = (repo: any) => {
    chrome.storage.sync.get("token", function (token) {
      // user name ????????????
      const url = API_BASE_URL + "/api/user/";
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUserName(data.data.name);
            let link = `https://github.com/${data.data.name}/${repo}`;
            setGitUrl(link);
          });
        }
      });
    });
  };

  // commit mode
  const handleCommit = (e: any) => {
    setCommitChecked(e.target.value);

    const url = API_BASE_URL + "/api/user/configs";
    fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        commit: e.target.value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          chrome.storage.sync.set({ commitConfig: e.target.value });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // timer shown
  const handleTimerShown = () => {
    setTimerShown((timerShown) => !timerShown);
    console.log(!timerShown);
    chrome.storage.sync.set({ timerShown: !timerShown }, function () {});
    const url = API_BASE_URL + "/api/user/configs";
    fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        timerShown: !timerShown,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteToken = () => {
    chrome.storage.sync.remove("token", function () {
      setAuthMode(true);
    });
  };

  const setTimer = () => {
    let h = String(hour).padStart(2, "0");
    let m = String(minute).padStart(2, "0");
    let s = String(second).padStart(2, "0");
    setHour(h);
    setMinute(m);
    setSecond(s);

    const url = API_BASE_URL + "/api/user/configs";
    fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        timerDefaultTime: `${h}:${m}:${s}`,
      }),
    })
      .then(() => {
      })

      .catch((error) => {});
  };
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value, min, max } = event.target;
    let result = String(
      Math.max(Number(min), Math.min(Number(max), Number(value)))
    ).padStart(2, "0");
    if (event.target.id === "hour") {
      setHour(result);
    }
    if (event.target.id === "minute") {
      setMinute(result);
    }
    if (event.target.id === "second") {
      setSecond(result);
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
    chrome.tabs.create({ url: welcome_url });
  };

  const goAlub = () => {
    const newUrl = `https://alub.co.kr`;
    chrome.tabs.create({ url: newUrl });
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
                <span style={{ color: "#20c997" }}>ALUB</span>?????? ??????,
                ???????????????????????? ?????? ???????????????
              </h4>
              <hr className="hr" />
              <h4 className="middle-title">
                Authenticate with GitHub to use ALUB
              </h4>
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
              <img
                className="logo"
                src={logo}
                alt={"logo"}
                onClick={() => goAlub()}
              />
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
                <span style={{ color: "#20c997" }}>ALUB</span>?????? ??????,
                ???????????????????????? ?????? ???????????????
              </h4>
              <hr className="hr" />
              <h4 className="middle-title">GitHub Repository??? ???????????????</h4>
              <button
                className="btn btn-lg btn-primary login-button"
                type="button"
                onClick={() => clickRepoSetting()}
              >
                <i className="fab fa-github "></i>
                <span className="login-button-title">Git Repository ??????</span>
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
          <img
            src={logo}
            alt={"logo"}
            className="logo"
            onClick={() => goAlub()}
          />
          <span>{userName}</span>
          <span>/</span>
          <a
            href={gitUrl}
            id="git-repo-name"
            className="dir-name"
            target="_blank"
          >
            {repoName}
          </a>
        </header>
        <main>
          <div id="commit-mode" className="app-main ">
            <div className="flex-column">
              <div className="commit-setting">
                <h4 className="middle-title">Commit ??????</h4>
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
                        ?????? ?????? ??? ???????????? ??? ????????? ???????????????
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
                        ?????? ?????? ??? ????????? ????????? ????????? ??? ?????????, ???????????????
                        ???????????????
                      </span>
                    </div>
                  </fieldset>
                </form>
              </div>
              <hr className="hr" />
              <div className="timer-setting">
                <h4 className="middle-title">????????? ??????</h4>
                <form>
                  <div className="form-check form-switch flex-grid">
                    <label className="form-check-label" htmlFor="timer-show">
                      ????????? ?????????
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="timer-show"
                      checked={timerShown === true}
                      onChange={handleTimerShown}
                    />
                  </div>
                </form>
                <form onSubmit={setTimer}>
                  <div className="flex-row default-time-set">
                    <span className="timer-show-title">?????? ?????? ??????</span>
                    <div className="flex-row">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="hour"
                        placeholder="hh"
                        min="0"
                        max="99"
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
                        max="59"
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
                        max="59"
                        value={second}
                        onChange={onChangeInput}
                      />
                      <button
                        type="submit"
                        className="btn btn-outline-primary timer-setting-button"
                      >
                        ??????
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
                onClick={() => clickRepoSetting()}
              >
                <i className="fab fa-github "></i>
                <span className="login-button-title">Git Repository ??????</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default App;
