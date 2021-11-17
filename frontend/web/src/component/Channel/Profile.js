import "./Profile.scoped.scss";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

import * as util from "../../modules/axios/util";

const Profile = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  const [userConfig, setUserConfig] = useState({});
  const [repoSelect, setRepoSelect] = useState("");

  const [repos, setRepos] = useState([]);

  const [inputs, setInputs] = useState({
    repoName: "",
    dirName: "",
  });
  const { repoName, dirName } = inputs;

  useEffect(() => {
    util.getUserConfig(storeToken).then((data) => {
      setUserConfig({ ...data.data });
    });

    util.getUserRepos(storeToken).then((data) => {
      setRepos([...data.data]);
      repoInit();
    });
  }, []);

  const repoInit = () => {
    if (userConfig.repoName === null && userConfig.dirPath === null) {
      setRepoSelect("newRepo");
      setInputs({
        ...inputs,
        repoName: "Alub",
      });
    } else if (userConfig.dirPath !== "") {
      setRepoSelect("existRepo");
      setInputs({
        repoName: userConfig.repoName,
        dirPath: userConfig.dirPath,
      });
    } else {
      setRepoSelect("newRepo");
      setInputs({
        repoName: userConfig.repoName,
        dirPath: "",
      });
    }
  };

  const handleInputs = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleRadio = (e) => {
    console.log(e.target.value);
    setRepoSelect(e.target.value);
  };

  const setGitRepoName = useCallback((user, repo, dir) => {
    if (repo === null) {
      return `연결된 레포지토리가 없습니다`;
    } else if (dir === null) {
      return `github.com/${user}/${repo}`;
    } else {
      return `github.com/${user}/${repo}/${dir}`;
    }
  });

  return (
    <div className="profile">
      <div className="container">
        <h1>내 계정 설정하기</h1>
        <section>
          <h4 className="title">Git 계정</h4>
          <div className="user-box">
            <div className="img-box">
              <img
                src={storeUserInfo.imageUrl}
                className="image"
                alt="profile"
              />
            </div>
            <div className="profile-box">
              <div className="grid-row">
                <p>사용자명</p>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={storeUserInfo.name}
                />
              </div>
              <div className="grid-row">
                <p>이메일</p>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={storeUserInfo.email}
                />
              </div>
              <div className="grid-row">
                <p>ALUB 레포</p>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={setGitRepoName(
                    storeUserInfo.name,
                    userConfig.repoName,
                    userConfig.dirPath
                  )}
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
                  value="github/eunsong/"
                />
                <input
                  type="text"
                  placeholder="레포지토리 이름"
                  className="form-control"
                  name="repoName"
                  value={repoName || ""}
                  onChange={handleInputs}
                />
                <button type="button" className="btn btn-primary">
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
                  value="github/eunsong/"
                />
                <select className="form-select" value="">
                  <option>1</option>
                  <option>2</option>
                </select>
                <input
                  type="text"
                  placeholder="디렉토리 이름"
                  className="form-control"
                  value={dirName}
                  name="dirName"
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="footer">
              <button type="button" className="btn btn-lg btn-success">
                등록
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
