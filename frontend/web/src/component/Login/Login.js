import "./Login.scoped.css";
import logo from "../../static/image/logo.png";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import * as actions from "../../modules/actions/user";

const Login = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const history = useHistory();

  const Login = () => {
    //axios로 어쩌구 저쩌구
    dispatch(actions.setToken(token));
    history.push("/");
  };

  const handletoken = (e) => {
    setToken(e.target.value);
  };
  return (
    <div className="login">
      <div className="container">
        <header>
          <img src={logo} alt="logo" className="logo" />
          <p className="logo-title">ALUB</p>
        </header>
        <div className="app-main">
          <h1 className="title">GitHub 로그인</h1>
          <input value={token} type="text" onChange={handletoken} />
          <button type="button" onClick={() => Login()}>
            로그인
          </button>
          <p>{storeToken}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
