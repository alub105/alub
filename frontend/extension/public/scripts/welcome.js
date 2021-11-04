var BASE_URL = "";
var START_URL = "";
var API_URL = "";

chrome.management.get(chrome.runtime.id, function (data) {
  // console.log(data);
  if (data.installType === "development") {
    BASE_URL = "http://localhost:8080";
    START_URL = "http://localhost:3000/oauth/redirect";
  } else {
    BASE_URL = "https://alub.co.kr";
    START_URL = "https://alub.co.kr/oauth/redirect";
  }
  API_URL = BASE_URL + "/api/user/";
});

var checkDuplicate = false;
var headers;
chrome.storage.sync.get("token", function (token) {
  console.log("token", token);
  headers = {
    Authorization: `Bearer ${token.token}`,
    "Content-Type": "application/json;charset=UTF-8",
  };
});

$(document).ready(function () {
  // 기존 repo 목록 가져오기
  fetch(API_URL + "repos", {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          var select = document.getElementById("exist-repo-names");
          for (var i = 0; i < data.data.length; i++) {
            var name = data.data[i].name;
            var el = document.createElement("option");
            el.textContent = name;
            el.value = "option" + i + 1;
            select.appendChild(el);
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const exists = document.getElementsByClassName("exist-repo-set");
  for (var i = 0; i < exists.length; i++) {
    exists[i].addEventListener("focus", function () {
      checkDuplicate = false;
      $("input:radio[id='exist-repo']").prop("checked", true);
      // $("#repo-name").val("");

      var input = document.getElementById("repo-name");
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
      $("#repo-duplicate-invalid").css("display", "none");
      $("#repo-duplicate-valid").css("display", "none");
    });
  }
});

// repo name 중복 체크
document.getElementById("repo-check-button").addEventListener("click", function () {
  var input = document.getElementById("repo-name");
  if (input.value === "") {
    input.focus();
    return;
  }
  const url = API_URL + "repos/" + input.value;
  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        checkDuplicate = true;

        response.json().then((data) => {
          if (data.code === "success") {
            var input = document.getElementById("repo-name");
            input.classList.add("is-invalid");
            $("#repo-duplicate-invalid").css("display", "block");
            $("#repo-duplicate-valid").css("display", "none");
          } else if (data.code === "fail") {
            var input = document.getElementById("repo-name");
            input.classList.add("is-valid");
            $("#repo-duplicate-invalid").css("display", "none");
            $("#repo-duplicate-valid").css("display", "block");
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

document.getElementById("repo-name").addEventListener("focus", function () {
  $("input:radio[id='new-repo']").prop("checked", true);
});

// repo 생성 버튼 클릭
document.getElementById("create-repo-button").addEventListener("click", function () {
  const setting = $("input[name='repo-setting']:checked").val();

  let repoName = "";
  let creation = "";
  let dirPath = "";

  if (setting === "new-repo") {
    if (!checkDuplicate) {
      $("#repo-check-button").focus();
      return;
    }
    repoName = $("#repo-name").val();
    creation = true;
  } else if (setting === "exist-repo") {
    repoName = $("select[id='exist-repo-names'] option:selected").text();
    creation = false;
    dirPath = $("#dir-name").val();
  }
  console.log(repoName, dirPath);

  fetch(API_URL + "repos", {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({
      repoName: repoName,
      creation: creation,
      dirPath: dirPath,
    }),
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
