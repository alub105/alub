/* eslint-disable */
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StyleSheetManager } from "styled-components";

import * as util from "../../modules/axios/util";
import "./StudyHome.scoped.scss";

const StudyHome = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);

  const { runningStudyList: storeRunningStudyList } = useSelector(
    (state) => state.study
  );
  const { endedStudyList: storeEndedStudyList } = useSelector(
    (state) => state.study
  );

  const [mode, setMode] = useState("");
  const channelId = match.params.channelId;
  const [studyInfo, setStudyInfo] = useState({});

  useEffect(() => {
    if (channelId < 0) {
      return;
    }
    util.getStudyInfo(channelId, storeToken).then((data) => {
      setStudyInfo(data.data);
    });

    setTag();
  }, [channelId, mode, storeRunningStudyList, storeEndedStudyList]);

  const runningSplitTime = useCallback((endTime) => {
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `${year[1]}월 ${year[2]}일  ${time[0]}:${time[1]}`;
  });

  const endSplitTime = useCallback((endTime) => {
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `완료: ${year[1]}월 ${year[2]}일  ${time[0]}:${time[1]}`;
  });

  const setTag = () => {
    let now = new Date().toLocaleDateString();
    now = now.replace(/\s+/g, "");
    now = now.replaceAll(".", "-");
    now = now.slice(0, -1);
    let time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    });
    let current = now + " " + time;

    if (studyInfo.startTime < current && studyInfo.endTime < current) {
      setMode("진행");
    } else {
      setMode("예정");
    }
  };

  return (
    <div className="study-home">
      <h1>{studyInfo?.name} 홈</h1>
      <div className="study-wrapper">
        <div className="studies">
          <div className="study-list">
            <h3>진행 중인 스터디</h3>
            <table>
              <tbody>
                {storeRunningStudyList?.map((study, index) => {
                  return (
                    <tr key={index}>
                      <td className="name">
                        <Link to={`/channel/${channelId}/study/${study.id}`}>
                          <i className="far fa-hashtag" />
                          {study.name}
                        </Link>
                      </td>
                      <td className="time">
                        <span
                          className="tag running"
                          style={{
                            display: mode === "진행" ? "block" : "none",
                          }}
                        >
                          진행: {runningSplitTime(study.endTime)}
                        </span>
                        <span
                          className="tag todo"
                          style={{
                            display: mode === "예정" ? "block" : "none",
                          }}
                        >
                          예정: {runningSplitTime(study.endTime)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="study-list end">
            <div className="end">
              <h3>완료된 스터디</h3>
              <button type="button" className="btn btn-primary">
                더보기
              </button>
            </div>
            <table>
              <tbody>
                {storeEndedStudyList
                  ?.filter((item, idx) => idx < 10)
                  .map((study, index) => {
                    return (
                      <tr key={index}>
                        <td className="name">
                          <Link to={`/channel/${channelId}/study/${study.id}`}>
                            <i className="far fa-hashtag" />
                            {study.name}
                          </Link>
                        </td>
                        <td className="time">
                          <span className="tag done">
                            {endSplitTime(study.endTime)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHome;
