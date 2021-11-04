import React, { useEffect, useState } from "react";
import { ChromeMessage, Sender, getCurrentTabUId, getCurrentTabUrl } from "./types";
import "./css/App.css";
import logo from "./image/logo.png";
import "./css/bootstrap.min.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");
  const [bojId, setBojId] = useState("");

  const client_id = "4e92f22f41639a118b4c";
  const redirect_uri = "http://localhost:3000/oauth/redirect?platform=EXTENSION";

  const [btnDisabled, setBtnDisabled] = useState(false);
  const [authMode, setAuthMode] = useState(false);

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || "undefined");
    });
    getBojInfo();
    addStatusTable();
    checkToken();
  }, []);

  const checkToken = () => {
    chrome.storage.sync.get("token", function (token) {
      if (typeof token !== "undefined") {
        setAuthMode(true);
      }
    });
  };

  const deleteToken = () => {
    chrome.storage.sync.remove("token", function () {
      setAuthMode(false);
    });
  };

  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "Hello from React",
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (responseFromContentScript) => {
          setResponseFromContent(responseFromContentScript);
        });
    });
  };

  const sendCopyMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "copy",
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (responseFromContentScript) => {
          setResponseFromContent(responseFromContentScript);
        });
    });
  };

  const sendRemoveMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "delete logo",
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setResponseFromContent(response);
        });
    });
  };
  const getBojInfo = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "get boj info",
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setBojId(response);
        });
    });
  };
  const addStatusTable = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "add status table",
    };

    getCurrentTabUId((id) => {
      id &&
        chrome.tabs.sendMessage(id, message, (response) => {
          setResponseFromContent(response);
        });
    });
  };

  // authenticate button click
  const gitLogin = () => {
    if (btnDisabled !== false) return;
    setBtnDisabled(true);
    const newUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo`;
    chrome.tabs.create({ url: newUrl });
  };

  if (!authMode) {
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
                          value="default"
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
                          value="custom"
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
                    <input className="form-check-input" type="checkbox" id="timer-show" />
                  </div>
                  <div className="flex-row default-time-set">
                    <span className="timer-show-title">기본 시간 설정</span>
                    <div className="flex-row">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="hour"
                        placeholder="hh"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="minute"
                        placeholder="mm"
                        min="0"
                        max="60"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        id="second"
                        placeholder="ss"
                        min="0"
                        max="60"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary timer-setting-button"
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
                Git Repo 설정
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default App;
