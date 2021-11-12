import { React } from "react";
import "./NotFound.scoped.css";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  const goHome = () => {
    history.push("/");
  };
  return (
    <div className="notfound">
      <div className="container">
        <h1 className="title">404</h1>
        <p>길을 잃으셨나봐요! 메인 페이지로 돌아가 보세요.</p>
        <button
          type="button"
          className="btn btn-lg btn-outline-light go-main-btn"
          onClick={() => goHome()}
        >
          메인 페이지
        </button>
      </div>
    </div>
  );
};

export default NotFound;
