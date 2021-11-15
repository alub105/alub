/* eslint-disable */
import { COMPLETIONSTATEMENT_TYPES } from "@babel/types";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Route, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/index";
import "./StudyHome.scoped.scss";

const StudyHome = ({ match }) => {
  const { studyInfo: storeStudyInfo } = useSelector((state) => state.study);
  const { token: storeToken } = useSelector((state) => state.user);
  const { channelId } = match.params;

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
    fetch(API_BASE_URL + `/api/channels/${channelId}/studies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // console.log(data);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const runningSplitTime = (endTime) => {
    console.log(endTime);
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `~ ${year[1]}.${year[2]}  ${time[0]}:${time[1]}`;
  };

  const endSplitTime = (endTime) => {
    console.log(endTime);
    const yt = endTime.split(" ");
    const year = yt[0].split("-");
    const time = yt[1].split(":");
    return `완료: ${year[1]}.${year[2]}  ${time[0]}:${time[1]}`;
  };

  return (
    <div className="study-home">
      <h1>{storeStudyInfo.name} </h1>
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
                          <span className="tag done">{endSplitTime(study.endTime)}</span>
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
