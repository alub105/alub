/* eslint-disable */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Route, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/index";
import "./StudyHome.scoped.scss";

const StudyHome = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { selectedChannel: storeSelectedChannel } = useSelector(
    (state) => state.study
  );
  const { channelId } = match.params.channelId;
  const [studyInfo, setStudyInfo] = useState({});

  const [runningStudyList, setRunningStudyList] = useState([
    {
      id: 5,
      startTime: "2021-11-05 20:00:00",
      endTime: "2021-11-15 20:00:00",
      studyName: "5주차 스터디",
    },
    {
      id: 6,
      startTime: "2021-11-05 20:00:00",
      endTime: "2021-11-15 20:00:00",
      studyName: "6주차 스터디",
    },
  ]);

  const [endStudyList, setEndStudyList] = useState([
    {
      id: 4,
      startTime: "2021-11-01 20:00:00",
      endTime: "2021-11-03 20:00:00",
      studyName: "4주차 스터디",
    },
    {
      id: 3,
      startTime: "2021-11-01 20:00:00",
      endTime: "2021-11-03 20:00:00",
      studyName: "3주차 스터디",
    },
  ]);

  useEffect(() => {
    if (channelId < 0) {
      return;
    }
    fetch(API_BASE_URL + `/api/channels/${storeSelectedChannel}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // host , member, study name set
            setStudyInfo(data.data);

            fetch(API_BASE_URL + `/api/channels/${channelId}/studies`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storeToken}`,
                "Content-Type": "application/json;charset=UTF-8",
              },
            })
              .then((response) => {
                if (response.ok) {
                  response.json().then((data) => {});
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storeSelectedChannel]);

  const runningSplitTime = (endTime) => {
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `진행: ${year[1]}월 ${year[2]}일  ${time[0]}:${time[1]}`;
  };

  const endSplitTime = (endTime) => {
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `완료: ${year[1]}월 ${year[2]}일  ${time[0]}:${time[1]}`;
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
                {runningStudyList.map((study, index) => {
                  return (
                    <tr key={index}>
                      <td className="name">
                        <Link to={`study/${study.id}`}>
                          <i className="far fa-hashtag" />
                          {study.studyName}
                        </Link>
                      </td>
                      <td className="time">
                        <span className="tag running">
                          {useMemo(() => runningSplitTime(study.endTime))}
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
                {endStudyList
                  .filter((item, idx) => idx < 10)
                  .map((study, index) => {
                    return (
                      <tr key={index}>
                        <td className="name">
                          <Link to={`study/${study.id}`}>
                            <i className="far fa-hashtag" />
                            {study.studyName}
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
