/* eslint-disable */
import "./Member.scoped.scss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as util from "../../modules/axios/util";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Member = ({ match }) => {
  const channelId = match.params.channelId;
  const { token: storeToken } = useSelector((state) => state.user);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    util.getMembers(channelId, storeToken).then((data) => {
      setMembers([...data.data]);
    });
  }, []);

  const goGit = (member) => {
    let url = `https://github.com/${member.name}/${member.repoName}/`;
    window.open(url, "_blank").focus();
  };

  return (
    <div className="member">
      <div className="container">
        <h1>멤버 조회</h1>
        <div className="table-box ">
          <div className="flex-column">
            {members.map((member, index) => {
              if (member.repoName === null) {
                return (
                  <div className="grid" key={index}>
                    <p className="name">{member.name}</p>
                    <div className="git">
                      <p className="warn">
                        아직 레포지토리를 설정하지 않았어요
                      </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <OverlayTrigger
                    delay={{ hide: 1, show: 1 }}
                    overlay={(props) => (
                      <Tooltip {...props} className="mytooltip">
                        깃허브 방문
                      </Tooltip>
                    )}
                    placement="right"
                    key={index}
                  >
                    <div className="grid" onClick={() => goGit(member)}>
                      <p className="name">{member.name}</p>
                      <div className="git">
                        <i className="fab fa-github" />
                        <p className="repo">
                          github/{member.name}/{member.repoName}/
                          {member.dirPath}
                        </p>
                      </div>
                    </div>
                  </OverlayTrigger>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
