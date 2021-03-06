/* eslint-disable */
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as util from "../../modules/axios/util";
import "./StudyHome.scoped.scss";

const StudyHome = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { isCreateNewStudy: setIsCreateNewStudy } = useSelector(
    (state) => state.study
  );

  const [runningStudyList, setRunningStudyList] = useState([]);
  const [endedStudyList, setEndedStudyList] = useState([]);

  const routeChannelId = match.params.channelId;
  var channelId = 0;
  const [studyInfo, setStudyInfo] = useState({});

  useEffect(() => {
    // 새로고침할 때
    let url = window.location.href;
    let temp = url.split("channel/");
    if (temp[1].includes("/")) {
      let _channelId = temp[1].split("/");
      channelId = _channelId[0];
    } else {
      channelId = temp[1];
    }

    util.getStudyList(channelId, storeToken).then((data) => {
      setRunningStudyList(data.data.running);
      setEndedStudyList(data.data.ended);
    });
    util.getStudyInfo(channelId, storeToken).then((data) => {
      setStudyInfo(data.data);
    });
  }, [channelId, routeChannelId, setIsCreateNewStudy]);

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

  const setTag = useCallback((study) => {
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

    if (
      study.assignmentStartTime < current &&
      current < study.assignmentEndTime
    ) {
      // 진행
      return true;
    } else {
      // 예정
      return false;
    }
  });

  return (
    <div className="study-home">
      <h1>{studyInfo?.name} 홈</h1>
      <div className="study-wrapper">
        <div className="studies">
          <div className="study-list">
            <h3>진행 중인 스터디</h3>
            <table>
              <tbody>
                {runningStudyList?.map((study, index) => {
                  return (
                    <tr key={index}>
                      <td className="name">
                        <Link
                          to={`/channel/${routeChannelId}/study/${study.id}`}
                        >
                          <i className="far fa-hashtag" />
                          {study.name}
                        </Link>
                      </td>
                      <td className="time">
                        <span
                          className="tag running"
                          style={{
                            display: setTag(study) ? "block" : "none",
                          }}
                        >
                          진행: {runningSplitTime(study?.assignmentEndTime)}
                        </span>
                        <span
                          className="tag todo"
                          style={{
                            display: setTag(study) ? "none" : "block",
                          }}
                        >
                          예정: {runningSplitTime(study?.assignmentEndTime)}
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
                {endedStudyList
                  ?.filter((item, idx) => idx < 20)
                  .map((study, index) => {
                    return (
                      <tr key={index}>
                        <td className="name">
                          <Link
                            to={`/channel/${routeChannelId}/study/${study.id}`}
                          >
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
