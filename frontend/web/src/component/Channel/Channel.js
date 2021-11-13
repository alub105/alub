<<<<<<< HEAD
/* eslint-disable */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { API_BASE_URL } from "../../config/index";
=======
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
>>>>>>> 7bb454397d2a39399ee31713e5a57bff7cbc44a4

import SideBarChannel from "../SideBar/SideBarChannel";
import SideBarStudy from "../SideBar/SideBarStudy";

<<<<<<< HEAD
import * as userActions from "../../modules/actions/user";

const Channel = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!storeToken || storeToken === "") {
      history.push("/");
    } else {
      // user 정보 가져오기
      fetch(API_BASE_URL + "/api/user/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storeToken}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            dispatch(userActions.setUserInfo(data.data));
          });
        }
      });
    }
  }, [storeToken]);
=======
const Channel = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const history = useHistory();
  useEffect(() => {
    console.log(storeToken);
    if (!storeToken || storeToken === "") {
      console.log("no token ", storeToken);
      history.push("/");
    }
  }, []);
>>>>>>> 7bb454397d2a39399ee31713e5a57bff7cbc44a4

  return (
    <div className="channel">
      <Router>
        <SideBarChannel />
        <SideBarStudy />
      </Router>
    </div>
  );
};

export default Channel;
