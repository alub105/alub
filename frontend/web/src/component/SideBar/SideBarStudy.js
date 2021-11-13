/* eslint-disable */
import React, { useState, useRef } from "react";
import "./SideBarStudy.scoped.scss";
import { useSpring, animated, config, useSpringRef } from "react-spring";

const SideBarStudy = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { width } = useSpring({
    from: { width: "232px" },
    width: isOpen ? "232px" : "0px",
  });

  const toggleSidebar = () => {
    setIsOpen((isOpen) => !isOpen);
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
          <div className="study">
            <div>🏠 HOME</div>
          </div>
          <div className="study collapse">
            <i className="fal fa-plus" />
            <span>스터디 추가</span>
          </div>
          <div className="study">
            <div>진행 중인 스터디</div>
          </div>
          <div className="study">
            <div>완료된 스터디</div>
          </div>
          <div className="study">
            <div>멤버 목록</div>
          </div>
          <div className="study">
            <div>스터디 설정</div>
          </div>
        </nav>
      </animated.div>
    </div>
  );
};

export default SideBarStudy;
