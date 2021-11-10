import "./LandingPage.scoped.css";
import background_ui from "../../static/image/background-ui.png";
import ellipse_blue from "../../static/image/Ellipse-blue.svg";
import ellipse_white from "../../static/image/Ellipse-white.svg";
import logo from "../../static/image/logo.png";
import meeting from "../../static/image/meeting.png";
import baekjoon from "../../static/image/baekjoon.png";
import github from "../../static/image/github.png";
import programmers from "../../static/image/programmers.png";

function LandingPage() {
  return (
    <div className="landing">
      <main>
        {/* -------- header ---------- */}
        <section>
          <div className="site-background">
            <img src={background_ui} className="background-ui" />
            <a href="#">
              <img src={logo} alt="logo" className="logo" />
            </a>
            <h1 className="title">
              <span className="logo-title">ALUB</span>에 오신 것을 환영합니다
            </h1>
            <div className="title-box">
              <h3 className="sub-title">
                ALUB은 GitHub Repository를 손쉽게 연동해주고 백준과 프로그래머스 문제를 자동으로
                커밋하는 Extension입니다. ALUB 스터디 사이트는 이런 Extension에 기반해 문제집
                사이트에서 SUCCESS한 코드를 바로 가져와 보여줍니다.
              </h3>
            </div>
            <div>
              <div className="button-box">
                <button type="button" class="btn btn-dark btn-lg">
                  <i class="fab fa-chrome" />
                  Extension 설치하기
                </button>
                <button type="button" class="btn btn-outline-light btn-lg">
                  <i class="fab fa-github" />
                  GitHub 로그인
                </button>
              </div>
            </div>
          </div>
          <img src={ellipse_blue} className="ellipse" />
        </section>
        {/* -----x-- header -x-------- */}
        {/* -------- descript ---------- */}
        <section className="section1">
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
        <section className="section2">
          <div className="flex-column text-box">
            <h1>백준, 프로그래머스에 특화된 스터디</h1>
            <p>
              백준, 프로그래머스의 문제를 검색해 문제집을 만들 수 있어요. 그야말로 개발자를 위한
              스터디 아닌가요?
            </p>
          </div>
          <div className="image-box ">
            <div>
              <img src={programmers} alt="programmers" className="programmers" />
            </div>
            <div>
              <img src={baekjoon} alt="baekjoon" className="baekjoon" />
            </div>
            <div>
              <img src={github} alt="github" className="github" />
            </div>
          </div>
        </section>
        <section className="section3">
          <div className="image-box " />
          <div className="flex-column text-box">
            <h1>백준, 프로그래머스에 특화된 스터디</h1>
            <p>
              백준, 프로그래머스의 문제를 검색해 문제집을 만들 수 있어요. 그야말로 개발자를 위한
              스터디 아닌가요?
            </p>
          </div>
        </section>
        <img src={ellipse_white} className="ellipse-white" />
        {/* -----x-- descript -x-------- */}
      </main>
      <footer>
        <div className="footer">{/* <h1>footer</h1> */}</div>
      </footer>
    </div>
  );
}

export default LandingPage;
