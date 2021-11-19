/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { API_BASE_URL } from "../../config/index";
import qs from "qs";

import MiniMap from "./MiniMap";
import UserCodeList from "./UserCodeList";
import "./CodeView.scoped.scss";

import * as util from "../../modules/axios/util";

const CodeView = ({ match, location }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const channelId = match.params.channelId;
  const siteName = query.siteName;
  const problemNum = query.problemNum;

  const [userList, setUserList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [problemInfo, setProblemInfo] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //utterances redirect

    getMembers();
    getProblem();

    let problemParams = problemNum.split("&");
    if (problemParams.length > 1) {
      problemNum = problemParams[0];
    }
  }, []);

  function getProblem() {
    util.searchProblem(siteName, problemNum, storeToken).then((data) => {
      setProblemInfo(data.data[0]);
    });
  }

  function getMembers() {
    fetch(API_BASE_URL + `/api/channels/${channelId}/members`, {
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFileList(new Array(data.data.length));
        getFileList(data.data);
      })
      .then(() => {});
  }

  async function getFileList(members) {
    const result = await Promise.all(
      members.map(async (member, idx) => {
        const res = await fetch(
          API_BASE_URL +
            `/api/users/${
              member.id
            }/sites/${siteName}/problems/${problemNum}/files`,
          {
            headers: {
              Authorization: `Bearer ${storeToken}`,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        )
          .then((res) => res.json())
          .then(async (data) => {
            const file = {
              idx: idx,
              member: member,
              codeList: data.data,
            };

            fileList[idx] = file;
          })
          .finally(() => {
            setLoading(false);
          });
      })
    );

    setUserList(members.filter((user, idx) => fileList[idx].codeList != null));
    setFileList(fileList.filter((file) => file.codeList != null));
  }

  function handleOnDragEnd(result) {
    /**
     * 필요한 요소
     *  드래그할 대상의 index
     *  드래그가 끝났을때의 index
     *
     * 할 일
     * 1. 드래그할 대상의 index를 지운다
     * 2. 드래그가 끝난 당시의 index에 현재 드래그 중인 요소를 넣는다
     */

    if (!result.destination) return;

    const draggingItemIndex = result.source.index;
    const afterDragItemIndex = result.destination.index;

    const userTags = [...userList];
    const fileTags = [...fileList];
    const removeNameTag = userTags.splice(draggingItemIndex, 1);
    const removeFileTag = fileTags.splice(draggingItemIndex, 1);

    userTags.splice(afterDragItemIndex, 0, removeNameTag[0]);
    fileTags.splice(afterDragItemIndex, 0, removeFileTag[0]);

    setUserList([...userTags]);
    setFileList([...fileTags]);
  }

  return (
    <div className="codeview">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="header">
          <h1>
            [{siteName}] {problemInfo?.title} - {problemNum} -{" "}
            {problemInfo?.level}
          </h1>
          <div className="container">
            <MiniMap userList={userList} fileList={fileList} />
          </div>
        </div>
        <div className="fileList-wrap">
          <UserCodeList fileList={fileList} problemInfo={problemInfo} />
        </div>
        <div
          style={{
            display: !loading && fileList.length == 0 ? "block" : "none",
          }}
          className="no-file-div"
        >
          <h3>아직 제출한 멤버가 없습니다.</h3>
        </div>
        <div
          className="no-file-div"
          style={{ display: loading ? "block" : "none" }}
        >
          <div className="d-flex justify-content-center loading">
            <div
              className="spinner-border text-primary spinner-style"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default CodeView;
