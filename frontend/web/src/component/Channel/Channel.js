/* eslint-disable */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Route } from "react-router-dom";
import { API_BASE_URL } from "../../config/index";

import SideBarChannel from "../SideBar/SideBarChannel";
import SideBarStudy from "../SideBar/SideBarStudy";
import StudyHome from "../Study/StudyHome.js";

import * as userActions from "../../modules/actions/user";
import * as studyActions from "../../modules/actions/study";

const Channel = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
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

      //내 채널 리스트 가져오기
      fetch(API_BASE_URL + "/api/channels/mychannels", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storeToken}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              // data.data.channel.map((channel) => {
              //   dispatch(studyActions.setChannelList(channel));
              // });
              console.log(data.data);
              dispatch(studyActions.setChannelList(data.data.channel));
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
      <SideBarChannel match={match} />
      <SideBarStudy match={match} />
    </div>
  );
};

export default Channel;
