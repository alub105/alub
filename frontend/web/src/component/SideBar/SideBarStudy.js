/* eslint-disable */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import "./SideBarStudy.scoped.scss";
import { useSpring, animated } from "react-spring";
import { useSelector } from "react-redux";
import styled from "styled-components";

import * as util from "../../modules/axios/util";

import StudyHome from "../Study/StudyHome.js";
import StudyProblem from "../Study/StudyProblem.js";
import StudySetting from "../Study/StudySetting.js";
import StudyCreateModal from "../Modal/StudyCreateModal";
import Member from "../Study/Member";

const SideBarStudy = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  const [runningStudyList, setRunningStudyList] = useState([]);
  const [endedStudyList, setEndedStudyList] = useState([]);

  const routeChannelId = match.params.channelId;
  var channelId = 0;
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

  // 주소 정보 가져오기
  let url = window.location.href;
  let temp = url.split("channel/");
  if (temp[1].includes("/")) {
    let _channelId = temp[1].split("/");
    channelId = _channelId[0];
  } else {
    channelId = temp[1];
  }

  useEffect(() => {
    // 스터디 정보 가져오기
    util.getStudyInfo(channelId, storeToken).then((data) => {
      setStudyInfo({ ...data.data });
    });
    // 스터디 리스트 가져오기
    util.getStudyList(channelId, storeToken).then((data) => {
      setRunningStudyList(data.data.running);
      setEndedStudyList(data.data.ended);
    });
    initSidebarToggle();
  }, [
    channelId,
    routeChannelId,
    modalShow,
    doingChildRef?.current?.clientHeight,
    doneParentRef?.current?.clientHeight,
  ]);

  const initSidebarToggle = () => {
    setDoingOpen(true);
    setDoneOpen(true);

    doingParentRef.current.style.height = `${
      doingChildRef?.current?.clientHeight
    }px`;
    doneParentRef.current.style.height = `${
      doneChildRef?.current?.clientHeight
    }px`;
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
      if (doingParentRef.current === null || doingChildRef.current === null)
        return;
      if (doingParentRef.current.clientHeight > 0) {
        doingParentRef.current.style.height = "0%";
      } else {
        doingParentRef.current.style.height = `${
          doingChildRef.current.clientHeight
        }px`;
      }
      setDoingOpen(!doingOpen);
    },
    [doingOpen]
  );

  const doneToggle = useCallback(
    (e) => {
      console.log("done toggle");
      if (doneParentRef.current === null || doneChildRef.current === null) {
        return;
      }
      if (doneParentRef.current.clientHeight > 0) {
        doneParentRef.current.style.height = "0px";
      } else {
        doneParentRef.current.style.height = `${
          doneChildRef.current.clientHeight
        }px`;
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

      <animated.div
        style={{ width: width }}
        className="wrapper"
        id="sidebar-wrapper"
      >
        {/*------------------- 스터디 ------------------*/}
        <nav className="nav">
          <div>
            <div className="study item">
              <Link to={`/channel/${routeChannelId}`}>
                <div>🏠 HOME</div>
              </Link>
            </div>
            <div className="study create item" onClick={() => createStudy()}>
              <span>스터디 추가</span>
              <i className="fal fa-plus" />
            </div>
            {/*-------------- 진행중 스터디 -------------- */}
            <div className="study item" onClick={() => doingToggle()}>
              <i
                className={`fas fa-caret-right ${doingOpen ? "rotate" : ""}`}
              />
              진행 중인 스터디
            </div>
            <div className="doing" ref={doingParentRef}>
              <div className="list" ref={doingChildRef}>
                {runningStudyList?.map((study, index) => {
                  return (
                    <div className="child-study item" key={index}>
                      <Link to={`/channel/${routeChannelId}/study/${study.id}`}>
                        <i className="far fa-hashtag" />
                        <span>{study.name}</span>
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
                {endedStudyList?.map((study, index) => {
                  return (
                    <div className="child-study item" key={index}>
                      <Link to={`/channel/${routeChannelId}/study/${study.id}`}>
                        <i className="far fa-hashtag" />
                        <span>{study.name}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="study item">
              <Link to={`/channel/${routeChannelId}/member`}>
                <div>멤버 목록 </div>
              </Link>
            </div>
            <div
              className="study item"
              style={{
                display:
                  studyInfo?.host?.id === storeUserInfo.userId
                    ? "block"
                    : "none",
              }}
            >
              <Link to={`/channel/${routeChannelId}/setting`}>
                <div>채널 설정</div>
              </Link>
            </div>
          </div>
        </nav>
      </animated.div>
      <Main width={mainWidth}>
        {/*------------------ 메인 페이지 ------------------*/}
        <Route path="/channel/:channelId" exact={true} component={StudyHome} />
        {/* <Route
          path="/channel/:channelId"
          exact={true}
          render={() => <StudyHome isCreateNewStudy={isCreateNewStudy} />}
        /> */}
        {/*------------------ 스터디 채널 설정 페이지 ------------------*/}
        <Route path={`/channel/:channelId/setting`} component={StudySetting} />

        {/*------------------ 멤버 페이지 ------------------*/}
        <Route
          path="/channel/:channelId/member"
          exact={true}
          component={Member}
        />
        {/*------------------ 스터디 페이지 ------------------*/}
        <Route
          path={`/channel/:channelId/study/:studyId`}
          component={StudyProblem}
        />
      </Main>
      {/*---------------- 스터디 생성 모달 ----------------*/}
      <StudyCreateModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        id={channelId}
      />
    </div>
  );
};

const Main = styled.div`
  position: absolute;
  left: calc(${(props) => props.width || 0}px) !important;
  width: calc(100vw - 86px - ${(props) => props.width || 0}px);
  background-color: var(--white);
  height: 100vh;
  transition: left 0.2s ease !important;
`;
export default SideBarStudy;
