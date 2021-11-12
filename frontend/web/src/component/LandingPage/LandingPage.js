import "./LandingPage.scoped.css";
import background_ui from "../../static/image/background-ui.png";
import ellipse_blue from "../../static/image/Ellipse-blue.svg";
import ellipse_white from "../../static/image/Ellipse-white.svg";
import logo from "../../static/image/logo.png";
import meeting from "../../static/image/meeting.png";
import baekjoon from "../../static/image/baekjoon.png";
import programmers from "../../static/image/programmers.png";
import comparison from "../../static/image/comparison.jpg";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { OAUTH_REDIRECT_URI, CLIENT_ID } from "../../config/index";
import { useHistory } from "react-router";

import AOS from "aos";
import "aos/dist/aos.css";

import * as actions from "../../modules/actions/user";

function LandingPage() {
  const { token: storeToken } = useSelector((state) => state.user);
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    AOS.init();

    console.log(storeToken);
    if (!storeToken) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [storeToken]);

  // authenticate button click
  const gitLogin = () => {
    const newUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=repo`;
    window.open(newUrl, "_self").focus();
  };

  const logout = () => {
    dispatch(actions.setToken(""));
  };

  const goChannel = () => {
    history.push("/channel");
  };

  return (
    <div className="landing">
      <main>
        {/* -------- header ---------- */}
        <section>
          <div className="site-background">
            <img
              src={background_ui}
              className="background-ui"
              data-aos="fade-up"
              data-aos-delay="100"
            />
            <a href="#">
              <img src={logo} alt="logo" className="logo" />
            </a>
            <button
              type="button"
              className="btn btn-outline-light btn-lg login-button"
              onClick={() => gitLogin()}
              style={{ display: isLogin ? "none" : "block" }}
            >
              <i className="fab fa-github" />
              GitHub 로그인
            </button>
            <button
              type="button"
              className="btn btn-outline-light btn-lg login-button"
              onClick={() => logout()}
              style={{ display: isLogin ? "block" : "none" }}
            >
              <i className="fab fa-github" />
              로그아웃
            </button>
            <h1 className="title">
              <span className="logo-title">ALUB</span>에 오신 것을 환영합니다
            </h1>
            <div className="title-box">
              <h3 className="sub-title">
                ALUB 스터디는 백준과 프로그래머스 사이트에 특화된 온라인 코딩 스터디 사이트입니다.
                ALUB Extension을 설치하면 더 간편하게 스터디 할 수 있어요! 지금 시작해 볼까요?
              </h3>
            </div>
            <div>
              <div className="button-box">
                <button type="button" className="btn btn-dark btn-lg">
                  <i className="fab fa-chrome" />
                  Extension 설치하기
                </button>
                <button
                  type="button "
                  className="btn btn-outline-light btn-lg"
                  onClick={() => goChannel()}
                >
                  ALUB 스터디 시작하기
                </button>
              </div>
            </div>
          </div>
          <img src={ellipse_blue} className="ellipse" alt="elipse-blue" />
        </section>
        {/* -----x-- header -x-------- */}
        {/* -------- descript ---------- */}
        <section className="section1" data-aos="fade-up" data-aos-delay="100">
          <div className="image-box">
            <img src={meeting} alt="meeting" className="meeting" />
          </div>
          <div className="flex-column text-box">
            <h1>코딩 전용 온라인 스터디 채널을 만들어 보세요</h1>
            <p>
              ALUB 스터디는 그룹별 채널로 나뉩니다. 이메일을 통해 멤버를 초대하고, 스터디를
              생성하고, 과제를 만들 수 있어요.
            </p>
          </div>
        </section>
        <section className="section2" data-aos="fade-up" data-aos-delay="100">
          <div className="flex-column text-box">
            <h1>백준, 프로그래머스에 특화된 스터디</h1>
            <p>
              백준, 프로그래머스의 문제를 검색해 문제집을 만들 수 있어요. 사이트에서 문제를 제출하면
              바로 코드를 불러오기까지! 그야말로 개발자를 위한 스터디 아닌가요?
            </p>
          </div>
          <div className="image-box ">
            <div>
              <img src={programmers} alt="programmers" className="programmers" />
            </div>
            <div>
              <img src={baekjoon} alt="baekjoon" className="baekjoon" />
            </div>
            <div style={{ textAlign: "center" }}>
              <i className="fab fa-github fa-4x" />
            </div>
          </div>
        </section>
        <section className="section3" data-aos="fade-up" data-aos-delay="100">
          <div className="image-box ">
            <img src={comparison} alt="compare" className="compare" />
          </div>
          <div className="flex-column text-box">
            <h1>쉽고 보기 편한 코드 비교</h1>
            <p>
              스터디 하면서 코드를 한번에 비교하고 싶지 않나요? ALUB 스터디에서는 멤버의 코드를
              한곳에서 비교하고, 댓글을 달면 GitHub 이슈까지 생성됩니다!
            </p>
          </div>
        </section>
        <img src={ellipse_white} className="ellipse-white" alt="ellipse-white" />
        {/* -----x-- descript -x-------- */}
      </main>
      <footer>
        <div className="footer">
          <div className="footer-box">
            <p>© 2021 ALUB. All rights reserved.</p>
            <p>Git과 Email을 통해 자유롭게 이슈를 올려보세요</p>
            <div className="flex-row">
              <a href="https://github.com/alub105/alub" target="_blank">
                <i className="fab fa-github " />
              </a>
              <a
                href="https://mail.google.com/mail/u/0/?fs=1&to=alub105105@gmail.com&body=BODY&tf=cm"
                target="_blank"
              >
                <i className="fas fa-envelope " />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
