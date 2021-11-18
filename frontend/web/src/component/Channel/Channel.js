/* eslint-disable */
import "./Channel.scoped.scss";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, useHistory } from "react-router";
import { Route, Link } from "react-router-dom";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import SideBarStudy from "../SideBar/SideBarStudy";
import Profile from "./Profile.js";
import ChannelComponent from "../SideBar/ChannelComponent";
import ChannelCreateModal from "../Modal/ChannelCreateModal";
import CodeView from "../CodeView/CodeView";

import * as userActions from "../../modules/actions/user";
import * as studyActions from "../../modules/actions/study";

import * as util from "../../modules/axios/util";

const Channel = ({ match }) => {
  const { token: storeToken } = useSelector((state) => state.user);

  const { channelList: storeChannelList } = useSelector((state) => state.study);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  const [modalShow, setModalShow] = React.useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const [selectId, setSelectId] = useState(-1);

  useEffect(() => {
    if (!storeToken || storeToken === "") {
      history.push("/");
    } else {
      // user 정보 가져오기
      util.getUserInfo(storeToken).then((data) => {
        dispatch(userActions.setUserInfo(data.data));
      });

      //내 채널 리스트 가져오기
      util.getChannelList(storeToken).then((data) => {
        dispatch(studyActions.setChannelList(data.data));
      });

      let url = window.location.href;
      let temp = url.split("channel/");
      if (temp.length > 1) {
        temp = temp[1].split("/");
      }
      if (temp[0] === "common") {
        setSelectId(-1);
      } else if (temp[0] === "codeview") {
        let id = temp[1].split("?");
        setSelectId(id[0]);
      } else {
        setSelectId(Number(temp[0]));
      }
    }
  }, [storeToken]);

  const selectChannel = (value) => {
    dispatch(studyActions.setSelectedChannel(value));
  };

  const createNewChannel = () => {
    setModalShow(true);
  };

  const setClicked = (id) => {
    setSelectId(id);
  };

  return (
    <div className="channel">
      {/*-------------------------사이드바 1--------------------*/}
      <div className="sidebar-channel">
        <div className="wrapper">
          <nav className="nav">
            {/* --------------- 프로필 ---------------  */}
            <OverlayTrigger
              delay={{ hide: 1, show: 1 }}
              overlay={(props) => (
                <Tooltip {...props} className="mytooltip">
                  사용자 설정
                </Tooltip>
              )}
              placement="right"
            >
              <Link to="/channel/common/profile">
                <div
                  className={`image-box channel ${
                    selectId === -1 ? "selected-profile" : ""
                  }`}
                  onClick={() => setClicked(-1)}
                >
                  <img
                    className="image"
                    alt="profile"
                    src={storeUserInfo?.imageUrl}
                  />
                  <div className="overlay-profile" />
                </div>
              </Link>
            </OverlayTrigger>
            {/* --------------- 홈  ---------------  */}

            {storeChannelList.map((channel, index) => {
              return (
                <ChannelComponent
                  info={channel}
                  key={index}
                  selectId={selectId}
                  setClicked={setClicked}
                />
              );
            })}

            {/* --------------- 새 채널  ---------------  */}
            <OverlayTrigger
              delay={{ hide: 1, show: 1 }}
              overlay={(props) => (
                <Tooltip {...props} className="mytooltip">
                  새 채널 생성
                </Tooltip>
              )}
              placement="right"
            >
              <div>
                <button
                  className={`channel create-channel`}
                  onClick={() => createNewChannel()}
                >
                  <i className="fal fa-plus fa-2x" />
                  <div className="overlay-channel" />
                </button>
              </div>
            </OverlayTrigger>
          </nav>
        </div>
        {/*--------------- 스터디 생성 모달 ----------------------*/}
        <ChannelCreateModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
      <div className="router-main">
        <Switch>
          <Route path="/channel" exact={true} component={Profile} />
          <Route
            path="/channel/:channelId"
            exact={true}
            component={SideBarStudy}
          />
          <Route
            path="/channel/:channelId/study/:studyId"
            exact={true}
            component={SideBarStudy}
          />
          <Route
            path="/channel/:channelId/setting"
            exact={true}
            component={SideBarStudy}
          />
          <Route
            path="/channel/:channelId/member"
            exact={true}
            component={SideBarStudy}
          />
          <Route path="/channel/common/profile" component={Profile} />
          <Route path="/channel/codeview/:channelId" component={CodeView} />
          <Route render={() => <div>not</div>} />
        </Switch>
      </div>
    </div>
  );
};

export default Channel;
