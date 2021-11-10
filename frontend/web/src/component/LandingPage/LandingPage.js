import "./LandingPage.scoped.css";
import background_ui from "../../static/image/background-ui.png";
import ellipse from "../../static/image/Ellipse.svg";
import logo from "../../static/image/logo.png";

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
          <img src={ellipse} className="ellipse" />
        </section>
        {/* -----x-- header -x-------- */}
        {/* -------- descript ---------- */}
        <section className="section-1">
          <div className="image-content">sdf</div>
          <div className="descript">sdfsdfsdfsd </div>
        </section>
        {/* -----x-- descript -x-------- */}
      </main>
    </div>
  );
}

export default LandingPage;
