/* eslint-disable */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { BrowserRouter as Router } from "react-router-dom";

import { API_BASE_URL } from "../../config/index";

import SideBarChannel from "../SideBar/SideBarChannel";
import SideBarStudy from "../SideBar/SideBarStudy";

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
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              dispatch(userActions.setUserInfo(data.data));
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storeToken]);

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
