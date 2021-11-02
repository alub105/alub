export const getCurrentTabUrl = (callback: (url: string | undefined) => void): void => {
  const queryInfo = {active: true, currentWindow: true};

  chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      callback(tabs[0].url);
  });
}

export const getCurrentTabUId = (callback: (url: number | undefined) => void): void => {
  const queryInfo = {active: true, currentWindow: true};

  chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      callback(tabs[0].id);
  });
}

export const getBojId = (callback: (id: string | undefined) => void):void => {
  const queryInfo = {active: true, currentWindow: true};
  chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
    if (tabs[0].url?.includes("acmicpc.net")) {
      const id = document.querySelector(".loginbar .username")?.innerHTML
      callback(id)
    }
  });
}