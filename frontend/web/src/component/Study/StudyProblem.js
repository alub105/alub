/* eslint-disable */
import "./StudyProblem.scoped.scss";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import checked from "../../static/image/checked.png";
import cancel from "../../static/image/cancel.png";
import { useHistory } from "react-router";

import * as util from "../../modules/axios/util";

import { Alert, Button } from "react-bootstrap";

const StudyProblem = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);

  const studyId = match.params.studyId;
  const channelId = match.params.channelId;

  const [members, setMembers] = useState([]);

  const [studyDetail, setStudyDetail] = useState({});

  const [mode, setMode] = useState("");

  const [show, setShow] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // 스터디 정보 불러오기
    console.log(channelId, studyId);
    util.getStudyDetail(channelId, studyId, storeToken).then((data) => {
      setStudyDetail({ ...data.data });
      console.log(studyDetail);
      isFinish();
    });
    // 스터디 멤버 불러오기
    util.getMembers(channelId, storeToken).then((data) => {
      setMembers(data.data);
    });
  }, [studyId, channelId, mode]);

  const dateFormat = useCallback((str) => {
    if (str !== undefined) {
      let yt = str?.split(" ");
      let year = yt[0]?.split("-");
      return `${year[0]}년 ${year[1]}월 ${year[2]}일 ${yt[1]}`;
    } else {
      return str;
    }
  }, []);

  const problemFormat = useCallback((title, site, level, num) => {
    return `[${site}] ${title} ${num}번 - ${level}`;
  });

  const isFinish = () => {
    let now = new Date();
    now.setHours(now.getHours() + 9);
    now = now
      .toISOString()
      .replace("T", " ")
      .substring(0, 16);

    if (studyDetail.assignmentEndTime < now) {
      setMode("완료된 스터디");
    } else if (
      studyDetail.assignmentStartTime < now &&
      now < studyDetail.assignmentEndTime
    ) {
      setMode("진행 중 스터디");
    } else {
      setMode("예정된 스터디");
    }
  };

  const deleteStudy = () => {
    util.deleteStudy(channelId, studyId, storeToken).then((data) => {
      // console.log(data);
      history.push(`/channel/${channelId}`);
    });
  };

  const goBoj = (problem) => {
    if (problem.site === "BOJ") {
      let url = `https://www.acmicpc.net/problem/${problem.num}`;
      window.open(url, "_blank").focus();
    }
  };

  return (
    <div className="study-problem">
      <header className="header">
        <h1>{studyDetail?.name} </h1>

        <p className="label">미팅 일정: </p>
        <div className="time-tag">
          {dateFormat(studyDetail?.startTime)} &nbsp;<span>-</span> &nbsp;
          {dateFormat(studyDetail?.endTime)}
        </div>
      </header>
      <main>
        <div className="flex-row">
          <div
            className={`mode-tag todo`}
            style={{ display: mode === "예정된 스터디" ? "block" : "none" }}
          >
            <span>{mode}</span>
          </div>
          <div
            className={`mode-tag doing`}
            style={{ display: mode === "진행 중 스터디" ? "block" : "none" }}
          >
            <span>{mode}</span>
          </div>
          <div
            className={`mode-tag done`}
            style={{ display: mode === "완료된 스터디" ? "block" : "none" }}
          >
            {mode}
          </div>
          <p className="label">과제 기한: </p>
          <div className={`time-tag`}>
            {dateFormat(studyDetail?.assignmentStartTime)} &nbsp;<span>-</span>{" "}
            &nbsp;
            {dateFormat(studyDetail?.assignmentEndTime)}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="problem-td">문제</th>
              <th>코드비교</th>
              {members?.map((member, index) => {
                return <th key={index}>{member.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {studyDetail?.assignedProblems?.map((problem) => {
              return (
                <tr key={problem.id}>
                  <td onClick={() => goBoj(problem)} className="site">
                    {problemFormat(
                      problem.title,
                      problem.site,
                      problem.level,
                      problem.num
                    )}
                  </td>
                  <td className="go-code">
                    <Link
                      to={`/channel/codeview/${channelId}?siteName=${
                        problem.site
                      }&problemNum=${problem.num}`}
                    >
                      보러가기
                    </Link>
                  </td>
                  {problem?.members.map((member) => {
                    if (member.solved) {
                      return (
                        <td key={member.userId}>
                          <img
                            src={checked}
                            alt="solved image"
                            className="solved"
                          />
                        </td>
                      );
                    } else {
                      return (
                        <td key={member?.userId}>
                          <img
                            src={cancel}
                            alt="unsolved image"
                            className="solved"
                          />
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
      {/* <footer>
        <div className="footer">
          <button
            type="button"
            className="btn btn-danger"
            // onClick={() => setShow(true)}
          >
            삭제
          </button>
          <button type="button" className="btn btn-success">
            수정
          </button>
        </div>
      </footer> */}
      <Alert show={show} variant="dark" className="my-alert">
        <Alert.Heading> {studyDetail?.name} 삭제</Alert.Heading>
        <p>
          정말 {studyDetail?.name}을 삭제 하시겠습니까? 삭제된 스터디는 복구할
          수 없어요.
        </p>
        <hr />
        <div className="d-flex justify-content-center gap-3">
          <Button onClick={() => deleteStudy()} variant="danger">
            삭제
          </Button>
          <Button onClick={() => setShow(false)} variant="success">
            취소
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default StudyProblem;
