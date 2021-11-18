/* eslint-disable */
import "./Profile.scoped.scss";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";

import * as util from "../../modules/axios/util";

import { Toast } from "react-bootstrap";

const Profile = () => {
  let info = {};
  const repoRegex = /^[a-zA-Z0-9_.-]*$/;
  const dirRegex = /[/]{2,}/g;

  const { token: storeToken } = useSelector((state) => state.user);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  const selectRef = useRef();

  const [repoSelect, setRepoSelect] = useState("");
<<<<<<< HEAD
  const [repos, setRepos] = useState([]);
  const [existSelect, setExistSelect] = useState("");

  const [initRepoName, setInitRepoName] = useState("");

=======
  const [userConfig, setUserConfig] = useState({});
  const [repos, setRepos] = useState([]);
  const [existSelect, setExistSelect] = useState("");

>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
  const [errorMsg, setErrorMsg] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [errorMsg2, setErrorMsg2] = useState("");
  const [invalid2, setInvalid2] = useState(false);
  const [valid, setValid] = useState(false);
<<<<<<< HEAD
  const [invalid3, setInvalid3] = useState(false);
=======
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f

  const [duplicateCheck, setDuplicateCheck] = useState(false);

  //toast
  const [show, setShow] = useState(false);
  const [toastMsg, setToastMsg] = useState(
    "성공적으로 Repository 설정이 완료되었습니다."
  );

  const [inputs, setInputs] = useState({
    repoName: "",
    dirName: "",
  });
  const { repoName, dirName } = inputs;
<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [gitPath, setGitPath] = useState("");
=======
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f

  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    initStates();
  }, [isClick]);

  const initStates = () => {
    util.getUserRepos(storeToken).then((data) => {
      setRepos(repos.concat(data.data));
      repoInit();
    });
    util.getUserConfig(storeToken).then((data) => {
      info = data.data;
<<<<<<< HEAD
      let temp = `github/${storeUserInfo?.name}`;
      setInitRepoName(temp);

      if (info.repoPath === null) {
        setGitPath(`연결된 레포지토리가 없습니다.`);
      } else {
        setGitPath(
          `github/${storeUserInfo.name}/${info.repoName}/${info.dirPath}`
        );
      }
    });

    if (storeUserInfo.email === null) {
      setEmail("Git에 설정한 이메일이 없습니다");
    } else {
      setEmail(storeUserInfo.email);
    }
=======
      setUserConfig({ ...data.data });
    });
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
  };

  const repoInit = () => {
    if (info.repoName === null && info.dirPath === null) {
      setRepoSelect("newRepo");
      setInputs({
        ...inputs,
        repoName: "Alub",
      });
<<<<<<< HEAD
    } else if (info.dirPath === null || info.dirPath === "") {
=======
    } else if (info.dirPath === "") {
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
      setRepoSelect("newRepo");
      setInputs({
        repoName: info.repoName,
        dirName: "",
      });
    } else {
      setRepoSelect("existRepo");
      setExistSelect(info.repoName);
      setInputs({
        repoName: "",
        dirName: info.dirPath,
      });
    }
  };

  const handleInputs = (e) => {
    const { value, name } = e.target;

    setDuplicateCheck(false);
    setErrorMsg("");
    setInvalid(false);
    setErrorMsg2("");
    setInvalid2(false);
    setValid(false);
<<<<<<< HEAD
    setInvalid3(false);
=======
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f

    setInputs({
      ...inputs,
      [name]: value,
    });

    if (name === "repoName") {
      if (!repoRegex.test(repoName)) {
        setErrorMsg("형식에 맞지 않는 입력입니다");
        setInvalid(true);
        return;
      }
    } else if (name === "dirName") {
      let result = dirRegex.test(dirName);
      if (result) {
        setErrorMsg2("형식에 맞지 않는 입력입니다");
        setInvalid2(true);
        return;
      }
    }
  };

  const handleRadio = (e) => {
    setRepoSelect(e.target.value);
  };

  const handleExistRepo = (e) => {
    setExistSelect(e.target.value);
  };

  const focusHandler = (e) => {
    const { name } = e.target;
    if (name === "repoName") {
      setRepoSelect("newRepo");
    } else {
      setRepoSelect("existRepo");
    }
  };

<<<<<<< HEAD
=======
  const setGitRepoName = useCallback(
    (user, repo, dir) => {
      if (repo === null) {
        return `연결된 레포지토리가 없습니다`;
      } else if (dir === null) {
        return `github.com/${user}/${repo}`;
      } else {
        return `github.com/${user}/${repo}/${dir}`;
      }
    },
    [info]
  );

>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
  const searchRepoExist = () => {
    if (repoName === "") {
      return;
    }
    util.getRepoDuplicate(repoName, storeToken).then((data) => {
      if (data.code === "success") {
        setInvalid(true);
        setErrorMsg("이미 존재하는 레포지토리 입니다");
        return;
      } else if (data.code === "fail") {
        setInvalid(false);
        setValid(true);
        setInvalid(false);
        setDuplicateCheck(true);
      }
    });
  };

  const submit = () => {
    var _repoName = "";
    var _dirName = "";
    var _creation = false;

    if (repoSelect === "newRepo") {
      if (!duplicateCheck) {
        setErrorMsg("중복 체크를 해주세요");
        setInvalid(true);
        return;
      }

      if (!repoRegex.test(repoName)) {
        setErrorMsg("형식에 맞지 않는 입력입니다");
        setInvalid(true);
        return;
      }
      _repoName = repoName;
      _dirName = "";
      _creation = true;
    } else if (repoSelect == "existRepo") {
      let result = dirRegex.test(dirName);
      if (result) {
        setErrorMsg2("형식에 맞지 않는 입력입니다");
        setInvalid2(true);
        return;
      }

      if (existSelect === "") {
        selectRef.current.focus();
<<<<<<< HEAD
        setInvalid3(true);
        return;
=======
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
      }

      _repoName = existSelect;
      _dirName = dirName;
      _creation = false;
    }

    util.setRepo(_repoName, _creation, _dirName, storeToken).then((data) => {
      setRepos([...repos, { name: _repoName }]);
<<<<<<< HEAD

=======
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
      if (data.code === "fail") {
        setToastMsg("이미 존재하는 repository입니다.");
      } else {
        setToastMsg("성공적으로 Repository 설정이 완료되었습니다.");
      }
      setShow(true);
      info.repoName = _repoName;
<<<<<<< HEAD
      info.dirPath = _dirName;

=======
      info.dirPath = _repoName;
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
      let temp = _creation ? "newRepo" : "existRepo";
      setRepoSelect(temp);
      if (!temp) {
        setExistSelect("");
      }
      setIsClick((isClick) => !isClick);
    });
  };

  return (
    <div className="profile">
      <div className="container">
        <h1>내 계정 설정하기</h1>
        <section>
          <h4 className="title">Git 계정</h4>
          <div className="user-box">
            <div className="img-box">
              <img
<<<<<<< HEAD
                src={storeUserInfo?.imageUrl}
=======
                src={storeUserInfo.imageUrl}
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                className="image"
                alt="profile"
              />
            </div>
            <div className="profile-box">
              <div className="grid-row">
                <p>사용자명</p>
                <input
                  type="text"
                  className="form-control"
<<<<<<< HEAD
                  value={storeUserInfo?.name}
=======
                  value={storeUserInfo.name}
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                  readOnly
                />
              </div>
              <div className="grid-row">
                <p>이메일</p>
                <input
                  type="text"
                  readOnly
                  className="form-control"
<<<<<<< HEAD
                  value={email || ""}
=======
                  value={storeUserInfo.email}
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                />
              </div>
              <div className="grid-row">
                <p>ALUB 레포</p>
                <input
                  type="text"
                  readOnly
                  className="form-control"
<<<<<<< HEAD
                  value={gitPath || ""}
=======
                  value={setGitRepoName(
                    storeUserInfo.name,
                    userConfig.repoName,
                    userConfig.dirPath
                  )}
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                />
              </div>
            </div>
          </div>
        </section>
        <hr />
        <section className="repo">
          <h4 className="title">ALUB Repository 설정</h4>
          <p className="descript">
            Git Repository를 연결하면 제출한 문제를 사이트와 연동해 바로 코드를
            불러올 수 있습니다.
          </p>
          <form className="form flex-column">
            {/*------------------ 새 레포--------------- */}
            <div>
              <div className="form-check">
                <label htmlFor="new-repo" className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="repo-setting"
                    id="new-repo"
                    defaultValue="newRepo"
                    checked={repoSelect === "newRepo"}
                    onChange={handleRadio}
                  />
                  새 레포지토리 생성
                </label>
              </div>
              <div className="git-new-input">
                <input
                  type="text"
                  readOnly
                  placeholder=""
                  className="form-control"
<<<<<<< HEAD
                  value={initRepoName || ""}
=======
                  value="github/eunsong/"
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                />
                <div className="form-group has-success">
                  <input
                    type="text"
                    placeholder="레포지토리 이름"
                    className={`form-control ${invalid ? "is-invalid" : ""} 
                    ${valid ? "is-valid" : ""}`}
                    name="repoName"
                    value={repoName || ""}
                    onChange={handleInputs}
                    onFocus={focusHandler}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ display: invalid ? "block" : "none" }}
                  >
                    {errorMsg}
                  </div>
                  <div
                    className="valid-feedback"
                    style={{ display: valid ? "block" : "none" }}
                  >
                    생성 가능한 레포지토리 입니다
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => searchRepoExist()}
                >
                  중복 체크
                </button>
              </div>
            </div>
            {/*------------------ 기존 레포--------------- */}
            <div>
              <div className="form-check">
                <label htmlFor="exist-repo" className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="repo-setting"
                    id="exist-repo"
                    defaultValue="existRepo"
                    checked={repoSelect === "existRepo"}
                    onChange={handleRadio}
                  />
                  기존 레포지토리 연결
                </label>
              </div>
              <div className="git-exist-input">
                <input
                  type="text"
                  readOnly
                  placeholder=""
                  className="form-control"
<<<<<<< HEAD
                  value={initRepoName || ""}
                />
                <div>
                  <select
                    className="form-select"
                    value={existSelect || ""}
                    onChange={handleExistRepo}
                    onFocus={focusHandler}
                    ref={selectRef}
                  >
                    {repos.map((repo, index) => {
                      return (
                        <option key={index} value={repo.name}>
                          {repo.name}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className="invalid-feedback"
                    style={{ display: invalid3 ? "block" : "none" }}
                  >
                    레포지토리를 선택해 주세요.
                  </div>
                </div>
=======
                  value="github/eunsong/"
                />
                <select
                  className="form-select"
                  value={existSelect || ""}
                  onChange={handleExistRepo}
                  onFocus={focusHandler}
                  ref={selectRef}
                >
                  {repos.map((repo, index) => {
                    return (
                      <option key={index} value={repo.name}>
                        {repo.name}
                      </option>
                    );
                  })}
                </select>
>>>>>>> 840aebd4d6bacd39674c1e037c0e7485f5cf243f
                <div>
                  <input
                    type="text"
                    placeholder="디렉토리 이름"
                    className={`form-control ${invalid2 ? "is-invalid" : ""}`}
                    value={dirName}
                    name="dirName"
                    onChange={handleInputs}
                    onFocus={focusHandler}
                  />
                  <div
                    className="invalid-feedback"
                    style={{ display: invalid2 ? "block" : "none" }}
                  >
                    {errorMsg2}
                  </div>
                </div>
              </div>
            </div>
            <div className="footer">
              <button
                type="button"
                className="btn btn-lg btn-success"
                onClick={() => submit()}
              >
                등록
              </button>
            </div>
          </form>
        </section>
      </div>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        bg={"success"}
        className="toast"
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">ALUB</strong>
        </Toast.Header>
        <Toast.Body>{toastMsg}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Profile;
