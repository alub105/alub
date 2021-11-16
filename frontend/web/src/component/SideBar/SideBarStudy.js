/* eslint-disable */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./SideBarStudy.scoped.scss";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { API_BASE_URL } from "../../config/index";

import StudyHome from "../Study/StudyHome.js";
import Profile from "../Study/Profile.js";
import StudyProblem from "../Study/StudyProblem.js";
import StudySetting from "../Study/StudySetting.js";
import StudyCreateModal from "../Modal/StudyCreateModal";

const SideBarStudy = ({ match }) => {
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
  const { token: storeToken } = useSelector((state) => state.user);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);
  // 스터디 생성 모달 show
  const [modalShow, setModalShow] = useState(false);
  // 사이드바 토글
  const [isOpen, setIsOpen] = useState(true);
  const [doingOpen, setDoingOpen] = useState(true);
  const [doneOpen, setDoneOpen] = useState(true);
  // 진행중인 스터디 ref
  const doingParentRef = useRef();
  const doingChildRef = useRef();
  // 진행완료 스터디 ref
  const doneParentRef = useRef();
  const doneChildRef = useRef();
  // main 페이지 사이즈
  const [mainWidth, setMainWidth] = useState(232);
  const [studyInfo, setStudyInfo] = useState({
    name: "",
    host: {},
  });

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
    if (storeSelectedChannel > 0) {
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
              setStudyInfo(data.data);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storeSelectedChannel]);

  const getStudyList = () => {
    fetch(API_BASE_URL + `/api/channels/${storeSelectedChannel}/studies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response.json().then((data) => {});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { width } = useSpring({
    from: { width: "232px" },
    width: isOpen ? "232px" : "0px",
  });

  const toggleSidebar = () => {
    setIsOpen((isOpen) => !isOpen);

    if (isOpen) {
      setMainWidth(0);
    } else {
      setMainWidth(232);
    }
  };

  const doingToggle = useCallback(
    (e) => {
      if (doingParentRef.current === null || doingChildRef.current === null) return;
      if (doingParentRef.current.clientHeight > 0) {
        doingParentRef.current.style.height = "0%";
      } else {
        doingParentRef.current.style.height = `${doingChildRef.current.clientHeight}px`;
      }
      setDoingOpen(!doingOpen);
    },
    [doingOpen]
  );

  const doneToggle = useCallback(
    (e) => {
      if (doneParentRef.current === null || doneChildRef.current === null) return;
      if (doneParentRef.current.clientHeight > 0) {
        doneParentRef.current.style.height = "0px";
      } else {
        doneParentRef.current.style.height = `${doneChildRef.current.clientHeight}px`;
      }
      setDoneOpen(!doneOpen);
    },
    [doneOpen]
  );

  const createStudy = () => {
    setModalShow(true);
  };

  return (
    <div className="sidebar-study">
      <i
        className="fal fa-times close-icon"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={() => toggleSidebar()}
      />

      <div
        className="hamburger-icon"
        onClick={() => toggleSidebar()}
        style={{ display: isOpen ? "none" : "block" }}
      >
        <i className="fas fa-bars open-icon" />
      </div>

      <animated.div style={{ width: width }} className="wrapper" id="sidebar-wrapper">
        {/*------------------- 스터디 ------------------*/}
        <nav className="nav">
          <div>
            <div className="study item">
              <Link to={`/channel/${storeSelectedChannel}/home`}>
                <div>🏠 HOME</div>
              </Link>
            </div>
            <div className="study create item" onClick={() => createStudy()}>
              <span>스터디 추가</span>
              <i className="fal fa-plus" />
            </div>
            {/*-------------- 진행중 스터디 -------------- */}
            <div className="study item" onClick={() => doingToggle()}>
              <i className={`fas fa-caret-right ${doingOpen ? "rotate" : ""}`} />
              진행 중인 스터디
            </div>
            <div className="doing" ref={doingParentRef}>
              <div className="list" ref={doingChildRef}>
                {runningStudyList.map((study, index) => {
                  return (
                    <div className="child-study item" key={index}>
                      <Link to={`/channel/${storeSelectedChannel}/study/${study.id}`}>
                        <i className="far fa-hashtag" />
                        <span>{study.studyName}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            {/*-------------- 완료 스터디 -------------- */}
            <div className="study item" onClick={() => doneToggle()}>
              <i className={`fas fa-caret-right ${doneOpen ? "rotate" : ""}`} />
              완료된 스터디
            </div>
            <div className="done" ref={doneParentRef}>
              <div className="list" ref={doneChildRef}>
                {endStudyList.map((study, index) => {
                  return (
                    <div className="child-study item" key={index}>
                      <Link to={`/channel/${storeSelectedChannel}/study/${study.id}`}>
                        <i className="far fa-hashtag" />
                        <span>{study.studyName}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="study item">
              <div>멤버 목록</div>
            </div>
            <div
              className="study item"
              style={{
                display: studyInfo.host.id === storeUserInfo.userId ? "block" : "none",
              }}
            >
              <Link to={`/channel/setting/${storeSelectedChannel}`}>
                <div>스터디 설정</div>
              </Link>
            </div>
          </div>
        </nav>
      </animated.div>
      <Main width={mainWidth}>
        {/*------------------ 메인 페이지 ------------------*/}
        <Route path="/channel/:channelId/home" exact={true} component={StudyHome} />
        {/*--------------------- 개인 페이지 ------------------*/}
        <Route path={`/channel/profile`} exact={true} component={Profile} />
        {/*------------------ 스터디 채널 설정 페이지 ------------------*/}
        <Route path={`/channel/setting/:channelId`} exact={true} component={StudySetting} />
        {/*------------------ 스터디 페이지 ------------------*/}
        <Route path={`/channel/:channelId/study/:studyId`} exact={true} component={StudyProblem} />
        {/*------------------ 멤버 페이지 ------------------*/}
      </Main>
      {/*---------------- 스터디 생성 모달 ----------------*/}
      <StudyCreateModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

const Main = styled.div`
  position: relative;
  left: calc(86px + ${(props) => props.width || 0}px);
  width: calc(100vw - 86px - ${(props) => props.width || 0}px);
  background-color: white;
  height: 100vh;
  transition: left 0.2s ease;
`;
export default SideBarStudy;
