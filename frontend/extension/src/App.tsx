import React, { useEffect, useState } from "react";
import { ChromeMessage, Sender, getCurrentTabUId, getCurrentTabUrl } from "./types";
import "./css/App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [responseFromContent, setResponseFromContent] = useState("");
  const [bojId, setBojId] = useState("");

  const client_id = "4e92f22f41639a118b4c";
  const redirect_uri = "http://localhost:3000/oauth/redirect?platform=EXTENSION";

  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || "undefined");
    });
    getBojInfo();
    addStatusTable();
  }, []);

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

  return (
    <div className="App">
      <header className="App-header flex-row">
        <h3 className="title">Alub</h3>
      </header>
      <main>
        <div id="auth_mode" className="App-main">
          <div className="authenticate">
            <h4 className="middle-title">Authenticate with GitHub to use Alub</h4>
            <button
              type="submit"
              className="login-button"
              onClick={() => gitLogin()}
              disabled={btnDisabled}
            >
              <i className="fab fa-github "></i>
              <span className="login-button-title">Authenticate</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
