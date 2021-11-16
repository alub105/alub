/* eslint-disable */
import React, { useEffect, useState } from "react";
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
        console.log(response);
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
                      <td className="time">2018~2019</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="study-list">
            <h3>완료된 스터디</h3>
            <table>
              <tbody>
                {endStudyList.map((study, index) => {
                  return (
                    <tr key={index}>
                      <td className="name">
                        <Link to={`study/${study.id}`}>
                          <i className="far fa-hashtag" />
                          {study.studyName}
                        </Link>
                      </td>
                      <td className="time">2018~2019</td>
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
