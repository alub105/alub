import { ChromeMessage, Sender, getCurrentTabUrl } from "../types";
// import copyCode from "./copyCode";
import addStatusTable from "./status-table.js";
import createTimer from "./createTimer.js";

type MessageResponse = (response?: any) => void;
const currentUrl = window.location.href;
const validateSender = (message: ChromeMessage, sender: chrome.runtime.MessageSender) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  if (message.message === "add status table") {
    addStatusTable();
    response("테이블에 버튼추가 끝");
  }

  const isValidated = validateSender(message, sender);

  if (isValidated && message.message === "copy") {
    // copyCode();
  }
  if (isValidated && message.message === "userInfo") {
    console.log(message.message.data);
    response("data");
  }

  if (isValidated && message.message.message === "setTimer") {
    const data = message.message.data;
    const hh = parseInt(data.hh);
    const mm = parseInt(data.mm);
    const ss = parseInt(data.ss);
    createTimer(hh, mm, ss);
    console.log("메세지는감.");
    response("타이머 셋팅 완료");
  }

  if (isValidated && message.message === "alarm") {
    response("노티하기");
  }
};

const main = () => {
  console.log("[content.ts] Main");
  /**
   * Fired when a message is sent from either an extension process or a content script.
   */
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();

// if (currentUrl.includes("acmicpc.net/source")) {
//   copyCode();
// }
