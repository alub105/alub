let BASE_URL = "";
let START_URL = "";
let API_URL = "";

var USER_GIT = "";
var USER_REPO = "";
var userName = "";

var checkDuplicate = false;
var headers;

var repoRegex = /^[a-zA-Z0-9_.-]*$/;
var dirRegex = /[/]{2,}/;

chrome.storage.sync.get("mode", function (mode) {
  if (mode.mode === "dev") {
    BASE_URL = "http://localhost:8080";
    START_URL = "http://localhost:3000/oauth/redirect";
  } else if (mode.mode === "prod") {
    BASE_URL = "https://alub.co.kr";
    START_URL = "https://alub.co.kr/oauth/redirect";
  }
  API_URL = BASE_URL + "/api/user/";
});

chrome.storage.sync.get("token", function (token) {
  headers = {
    Authorization: `Bearer ${token.token}`,
    "Content-Type": "application/json;charset=UTF-8",
  };
});

$(document).ready(function () {
  // 기존 repo 목록 가져오기
  getExistRepo(getUserUrl);

  // 기존 레포 addListener 붙이기
  const exists = document.getElementsByClassName("exist-repo-set");
  for (var i = 0; i < exists.length; i++) {
    exists[i].addEventListener("focusin", function () {
      checkDuplicate = false;
      $("input:radio[id='exist-repo']").prop("checked", true);

      var input = document.getElementById("repo-name");
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
      $("#repo-duplicate-invalid").css("display", "none");
      $("#repo-duplicate-valid").css("display", "none");
      $("#no-input-invalid").css("display", "none");

      $("#no-check-invalid").css("display", "none");
      $("#regex-invalid").css("display", "none");

      $("#dir-regex-invalid").css("display", "none");
      $("#dir-name").removeClass("is-invalid");
    });
  }
});

// 기존 repo 목록 가져오기
function getExistRepo(callback) {
  fetch(API_URL + "repos", {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          var select = document.getElementById("exist-repo-names");
          $("#exist-repo-names").empty();

          var el = document.createElement("option");
          el.textContent = "";
          el.value = "option";
          select.appendChild(el);
          for (var i = 0; i < data.data.length; i++) {
            var name = data.data[i].name;
            el = document.createElement("option");
            el.textContent = name;
            el.value = "option" + i;
            select.appendChild(el);
          }
          callback(getUserRepo);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// 유저 정보 가져오기(url)
function getUserUrl(callback) {
  fetch(API_URL, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          userName = data.data.name;
          USER_GIT = "github.com/" + data.data.name;
          $(".git-user-name").each(function () {
            $(this).attr("placeholder", USER_GIT);
          });
          callback();
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//유저 정보 가져오기 (repos, dir)
function getUserRepo() {
  fetch(API_URL + "configs", {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // 로딩 화면 끝내기
          $("#loading").addClass("hide");
          $("#content").css("display", "block");

          let isSet = true;
          // 설정 안했을 때
          if (data.data.repoName === null) {
            USER_REPO = "설정한 Repository가 없습니다";
            isSet = false;

            $("#new-repo").prop("checked", true);
            $("#repo-name").val("Alub");
          } else if (data.data.dirPath === null) {
            // 새 repo 설정
            USER_REPO = "github.com/" + userName + "/" + data.data.repoName;

            $("#new-repo").prop("checked", true);
            $("#repo-name").attr("placeholder", data.data.repoName);
          } else {
            // 기존 repo 설정
            USER_REPO =
              "github.com/" +
              userName +
              "/" +
              data.data.repoName +
              "/" +
              data.data.dirPath;

            $("#exist-repo").prop("checked", true);

            $("#exist-repo-names option")
              .filter(function () {
                return $(this).text() == data.data.repoName;
              })
              .attr("selected", true);

            $("#dir-name").attr("placeholder", data.data.dirPath);
          }
          $("#user-git").text(USER_REPO);

          if (isSet) {
            $("#user-git").addClass("user-hover");
            // repo 이름 클릭 시 깃헙 repo로 이동
            document
              .getElementById("user-git")
              .addEventListener("click", function () {
                const repoUrl = $("#user-git").text();
                var name = repoUrl.split("/");
                const url = `https://${name[0]}/${name[1]}/${name[2]}`;
                chrome.tabs.create({ url: url });
              });
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// repo name 중복 체크
document
  .getElementById("repo-check-button")
  .addEventListener("click", function () {
    $("#no-check-invalid").css("display", "none");
    $("#dir-regex-invalid").css("display", "none");
    $("#dir-name").removeClass("is-invalid");

    var input = document.getElementById("repo-name");
    if (input.value === "") {
      input.focus();
      return;
    }

    // 정규식 아닐 경우
    var isValid = repoRegex.test($("#repo-name").val());
    if (!isValid) {
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
            // 이미 존재하는 repo
            if (data.code === "success") {
              var input = document.getElementById("repo-name");
              input.classList.remove("is-valid");
              input.classList.add("is-invalid");
              $("#repo-duplicate-invalid").css("display", "block");
              $("#repo-duplicate-valid").css("display", "none");
            } else if (data.code === "fail") {
              var input = document.getElementById("repo-name");
              input.classList.remove("is-invalid");
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

// 새 레포 addEventListener
document.getElementById("repo-name").addEventListener("focusin", function () {
  $("input:radio[id='new-repo']").prop("checked", true);
  resetValid();
  checkDuplicate = false;
  $("#regex-invalid").css("display", "none");
  $("#repo-name").removeClass("is-invalid");

  $("#dir-regex-invalid").css("display", "none");
  $("#dir-name").removeClass("is-invalid");
});

// repo name 설정 입력 체크
document
  .getElementById("repo-name")
  .addEventListener("focusout", function (event) {
    var input = $("#repo-name").val();
    input = input.trim();
    input = input.replace(/\s/g, "-");
    $("#repo-name").val(input);

    var isValid = repoRegex.test($("#repo-name").val());
    if (!isValid) {
      $("#regex-invalid").css("display", "block");
      $("#repo-name").addClass("is-invalid");
    }
  });

//dir name 설정 입력 체크
document
  .getElementById("dir-name")
  .addEventListener("focusout", function (event) {
    var input = $("#dir-name").val();

    if (dirRegex.test(input)) {
      $("#dir-regex-invalid").css("display", "block");
      $("#dir-name").addClass("is-invalid");
      return;
    }

    input = input.trim();
    if (input.charAt(0) === "/") {
      input = input.substring(1, input.length);
    }
    if (input.charAt(input.length - 1) === "/") {
      input = input.substring(0, input.length - 1);
    }

    $("#dir-name").val(input);
  });

// repo 생성 버튼 클릭
document
  .getElementById("create-repo-button")
  .addEventListener("click", function () {
    const setting = $("input[name='repo-setting']:checked").val();
    $("#dir-regex-invalid").css("display", "none");
    $("#dir-name").removeClass("is-invalid");

    var repoName = "";
    var creation = "";
    var dirPath = "";
    var isNewRepo = true;

    if (setting === "new-repo") {
      // 값이 없을 경우
      if ($("#repo-name").val() === "") {
        $("#no-input-invalid").css("display", "block");
        var input = document.getElementById("repo-name");
        input.classList.add("is-invalid");
        return;
      }
      // Repo name 정규식 아닐 경우
      var isValid = repoRegex.test($("#repo-name").val());
      if (!isValid) {
        $("#regex-invalid").css("display", "block");
        $("#repo-name").addClass("is-invalid");
        return;
      }

      // 중복 체크를 안했을 경우
      if (!checkDuplicate) {
        $("#repo-check-button").focus();
        $("#no-check-invalid").css("display", "block");
        return;
      }
      repoName = $("#repo-name").val();
      creation = true;
    } else if (setting === "exist-repo") {
      // dir name 정규식
      if (dirRegex.test(input)) {
        $("#dir-regex-invalid").css("display", "block");
        $("#dir-name").addClass("is-invalid");
        return;
      }

      isNewRepo = false;

      repoName = $("select[id='exist-repo-names'] option:selected").text();
      creation = false;
      dirPath = $("#dir-name").val();
    }

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
            // console.log(data);
            if (data.code === "success") {
              if (isNewRepo) {
                USER_REPO = `github.com/${userName}/${repoName}`;
                $("#dir-name").val("");
                $("#dir-name").attr("placeholder", "디렉토리 이름");
                $("#exist-repo-names option:eq(0)").prop("selected", true);
              } else {
                USER_REPO = `github.com/${userName}/${repoName}/${dirPath}`;
                $("#repo-name").val("");
                $("#repo-name").attr("placeholder", "레포지토리 이름");
              }
              $("#user-git").text(USER_REPO);
              resetValid();
            } else {
              $("#my-toast-body").text(
                "Repository 설정에 실패했습니다. 이미 존재하는 Repository입니다."
              );
            }

            $("#my-toast").toast({ delay: 1500 });
            $("#my-toast").toast({ animation: true });
            $("#my-toast").toast("show");

            getExistRepo(function () {});
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

function resetValid() {
  var input = document.getElementById("repo-name");
  input.classList.remove("is-invalid");
  input.classList.remove("is-valid");
  $("#repo-duplicate-invalid").css("display", "none");
  $("#repo-duplicate-valid").css("display", "none");
  $("#no-input-invalid").css("display", "none");

  $("#no-check-invalid").css("display", "none");
}
