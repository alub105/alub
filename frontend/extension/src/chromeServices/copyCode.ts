// import axios from 'axios'

// var BASE_URL = "";

// chrome.management.get(chrome.runtime.id, function (data) {
//   if (data.installType === "development") {
//     BASE_URL = "http://localhost:8080";
//   } else {
//     BASE_URL = "https://alub.co.kr";
//   }
// });

const copyCode = () => {
  const userId = document.querySelector(".loginbar .username")?.innerHTML;
  const solvedUserId =
    document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]?.childNodes[1]
      ?.textContent;
  const resultTable = document.querySelector(".table-striped");
  const correct =
    resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes(
      "맞"
    );
  const problemNumber = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[2]?.textContent;
  const problemTitle = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.textContent;
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
  window.onload = function afterload() {
    if (url.includes("acmicpc.net")) {
      site = "BOJ";
    }
    if (url.includes("programmers")) {
      site = "PROGRAMMERS";
    }
    const data = {
      srcCode: answerCode,
      commit: "default",
      language: lang,
      runningTime: timeConsumed,
      runningMemory: memory,
      problemTitle: problemTitle,
      problemNumber: problemNumber,
      site: site,
    };

    if (correct) {
      //   chrome.storage.sync.get("token", function (token) {
      //     // console.log("commit to server");
      //     // console.log(BASE_URL);
      //     fetch(BASE_URL + "/api/user/commits", {
      //       method: "POST",
      //       headers: {
      //         Accept: "application/json",
      //         "Content-Type": "application/json;charset=UTF-8",
      //       },
      //       body: JSON.stringify({
      //         srcCode: answerCode,
      //         commit: "DEFAULT",
      //         language: lang,
      //         runningTime: timeConsumed,
      //         runningMemory: memory,
      //         problemName: problemName,
      //         problemNumber: problemNumber,
      //         site: site,
      //       }),
      //     })
      //       .then((response) => {
      //         if (response.ok) {
      //           response.json().then((data) => {
      //             console.log(data);
      //           });
      //         }
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //       });
      //   });
    }
    console.log(data);
  };
};

export default copyCode;

// {
//   srcCode: answerCode,
//   commit: config,
//   language: lang,
//   runningTime: timeConsumed,
//   runningMemory: memory,
//   problemName: problemName,
//   problemNumber: problemNumber,
//   site: site,
// }
