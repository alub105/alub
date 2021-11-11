import React from "react";
import "./Authenticate.scoped.css";
import { API_BASE_URL } from "../../config/index";

import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";
import * as actions from "../../modules/actions/user";

const Authenticate = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const url = window.location.href;
  const start_url = url.split("?");
  const params = start_url[1].split("&");
  const platform = params[0].split("=");
  const code = params[1].split("=");

  if (platform[1] === "WEB") {
    const api_url = API_BASE_URL + "/api/user/authenticate";

    fetch(api_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        code: code[1],
        platform: platform[1],
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            //token 저장
            dispatch(actions.setToken(data.data.token));
            history.push("/channel");
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="authenticate">
      <div className="container">
        <h1 className="title">Authenticate</h1>
        <div className="d-flex justify-content-center loading">
          <div className="spinner-border text-light spinner-style" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
