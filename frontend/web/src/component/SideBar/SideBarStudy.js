/* eslint-disable */
import React, { useState, useRef, useCallback, useEffect } from "react";
import "./SideBarStudy.scoped.scss";
import { useSpring, animated, config, useSpringRef } from "react-spring";
import styled from "styled-components";

const SideBarStudy = () => {
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

  useEffect(() => {}, []);

  const { width } = useSpring({
    from: { width: "232px" },
    width: isOpen ? "232px" : "0px",
  });

  const toggleSidebar = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const doingToggle = useCallback(
    (e) => {
      console.log(doingChildRef.current.clientHeight);
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
      console.log(doneChildRef.current.clientHeight);
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
              <div>🏠 HOME</div>
            </div>
            <div className="study create item">
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
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
              </div>
            </div>
            {/*-------------- 완료 스터디 -------------- */}
            <div className="study item" onClick={() => doneToggle()}>
              <i className={`fas fa-caret-right ${doneOpen ? "rotate" : ""}`} />
              완료된 스터디
            </div>
            <div className="done" ref={doneParentRef}>
              <div className="list" ref={doneChildRef}>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
                <div className="child-study item">
                  <i className="far fa-hashtag" />
                  <span>1주차 화요일 스터디</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="study item">
              <div>멤버 목록</div>
            </div>
            <div className="study item">
              <div>스터디 설정</div>
            </div>
          </div>
        </nav>
      </animated.div>
      <div className="main">
        <h1>Hello</h1>
      </div>
    </div>
  );
};

export default SideBarStudy;
