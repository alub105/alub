/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { API_BASE_URL } from "../../config/index";

import MiniMap from "./MiniMap";
import UserCodeList from "./UserCodeList";
import "./CodeView.scoped.css";

const CodeView = ({ match, location }) => {
  const { token: storeToken } = useSelector((state) => state.user);

  const query = location.search.split("=");

  const channelId = match.params.channelId;
  const siteName = query[1].split("&")[0];
  const problemNum = query[2];

  const [userList, setUserList] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getMembers();
  }, []);

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
          });
      })
    );

    setUserList(members.filter((user, idx) => fileList[idx].codeList != null ));
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

    console.log(result);
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
            {siteName} {problemNum}
          </h1>
          <MiniMap userList={userList} fileList={fileList} />
        </div>
        <UserCodeList fileList={fileList} />
      </DragDropContext>
    </div>
  );
};

export default CodeView;
