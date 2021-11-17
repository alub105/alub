/* eslint-disable */
import "./StudyProblem.scoped.scss";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import checked from "../../static/image/checked.png";
import cancel from "../../static/image/cancel.png";

import * as util from "../../modules/axios/util";

const StudyProblem = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const studyId = match.params.studyId;
  const channelId = match.params.channelId;

  const [members, setMembers] = useState([
    { id: 1, email: "ssafy@gamil.com", name: "choieunsong" },
    { id: 2, email: "ssafy@gamil.com", name: "dlguswjd0258" },
    { id: 3, email: "ssafy@gamil.com", name: "hoonti06" },
    { id: 4, email: "ssafy@gamil.com", name: "greenboy94" },
    { id: 5, email: "ssafy@gamil.com", name: "WoogiJung" },
  ]);

  const [studyDetail, setStudyDetail] = useState({
    id: 23,
    name: "5주차 스터디",
    startTime: "2021-09-12 00:00",
    endTime: "2021-09-12 02:00",
    assignmentStartTime: "2021-09-10 00:00",
    assignmentEndTime: "2021-09-11 00:00",
    assignedProblems: [
      {
        id: 32,
        num: 1,
        title: "hi1",
        site: "BOJ",
        level: "ruby1",
        members: [
          {
            userId: 1,
            userName: "choieunsong",
            solved: true,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "dlguswjd0258",
            solved: false,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "hoonti06",
            solved: true,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "greenboy94",
            solved: false,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "WoogiJung",
            solved: true,
            solvedTime: null,
          },
        ],
      },
      {
        id: 33,
        num: 1,
        title: "hi2",
        site: "BOJ",
        level: "ruby1",
        members: [
          {
            userId: 1,
            userName: "choieunsong",
            solved: true,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "dlguswjd0258",
            solved: false,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "hoonti06",
            solved: true,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "greenboy94",
            solved: false,
            solvedTime: null,
          },
          {
            userId: 1,
            userName: "WoogiJung",
            solved: true,
            solvedTime: null,
          },
        ],
      },
    ],
  });

  useEffect(() => {
    // 스터디 정보 불러오기
    // 스터디 멤버 불러오기
  }, [studyId, channelId]);

  const dateFormat = useCallback((date) => {
    let yt = date.split(" ");
    let year = yt[0].split("-");
    return `${year[0]}년 ${year[1]}월 ${year[2]}일 ${yt[1]}`;
  }, []);

  const problemFormat = useCallback((title, site, level) => {
    return `[${site}] ${title} - ${level}`;
  });

  return (
    <div className="study-problem">
      <header className="header">
        <h1>{studyDetail.name} </h1>

        <p>스터디 날짜: </p>
        <div className="time-tag">
          {dateFormat(studyDetail.startTime)} &nbsp;<span>-</span> &nbsp;
          {dateFormat(studyDetail.endTime)}
        </div>
      </header>
      <main>
        <div className="flex-row">
          <p>과제 기한: </p>
          <div className="time-tag assignment">
            {dateFormat(studyDetail.startTime)} &nbsp;<span>-</span> &nbsp;
            {dateFormat(studyDetail.endTime)}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="problem-td">문제</th>
              <th>코드비교</th>
              {members.map((member, index) => {
                return <th key={index}>{member.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {studyDetail.assignedProblems.map((problem) => {
              return (
                <tr key={problem.id}>
                  <td>{problemFormat(problem.title, problem.site, problem.level)}</td>
                  <td className="go-code">
                    {/* <Link to={`/channel/${channelId}/study/${studyId}/code`}>보러가기</Link> */}
                    보러가기
                  </td>
                  {problem.members.map((member) => {
                    if (member.solved) {
                      return (
                        <td key={member.userId}>
                          <img src={checked} alt="solved image" className="solved" />
                        </td>
                      );
                    } else {
                      return (
                        <td key={member.userId}>
                          <img src={cancel} alt="unsolved image" className="solved" />
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default StudyProblem;
