import { ChromeMessage, Sender, getCurrentTabUrl } from "../types";
import copyCode from "./copyCode";
import createTimer from "./createTimer";
type MessageResponse = (response?: any) => void
const currentUrl = window.location.href
const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    return sender.id === chrome.runtime.id && message.from === Sender.React;
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {

    const isValidated = validateSender(message, sender);
    
    if (message.message.message === "add status table") {
        
        console.log("메세지는감.")
        response("애드댓")
        
    }

    if (isValidated && message.message.message === "setTimer") {
        const data = message.message.data
        const hh = parseInt(data.hh)
        const mm = parseInt(data.mm)
        const ss = parseInt(data.ss)
        // createTimer(hh,mm,ss)
        console.log("메세지는감.")
        response("타이머 셋팅 완료")
        
    }

    if (isValidated && message.message=== "alarm") {
        response("노티하기")
        
    }


    
}

const main = () => {
    console.log('[content.ts] Main')
    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}



main();

if (currentUrl.includes("acmicpc.net/source")){
    console.log("카피되긴함?")
    copyCode();
}



