/* eslint-disable */
import React, { useEffect } from "react";
import "./SideBarChannel.scoped.scss";
import logo from "../../static/image/logo.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../../config/index";

import * as studyActions from "../../modules/actions/study";

import ChannelComponent from "./ChannelComponent";
import ChannelCreateModal from "../ChannelCreateModal/ChannelCreateModal";

const SideBarChannel = () => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);

  const { channelList: storeChannelList } = useSelector((state) => state.study);
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  useEffect(() => {
    selectChannel(storeSelectedChannel);
  }, [storeChannelList, storeSelectedChannel]);

  const selectChannel = (value) => {
    dispatch(studyActions.setSelectedChannel(value));
  };

  const createNewChannel = () => {
    setModalShow(true);
  };

  return (
    <div className="sidebar-channel">
      <div className="wrapper">
        <nav className="nav">
          {/* --------------- 프로필 ---------------  */}
          <OverlayTrigger
            delay={{ hide: 5, show: 5 }}
            overlay={(props) => (
              <Tooltip {...props} className="mytooltip">
                사용자 설정
              </Tooltip>
            )}
            placement="right"
          >
            <div
              className={`image-box channel ${
                storeSelectedChannel === -1 ? "selected-profile" : ""
              }`}
              onClick={() => selectChannel(-1)}
            >
              <img className="image" alt="profile" src={storeUserInfo.imageUrl} />
              <div className="overlay-profile" />
            </div>
          </OverlayTrigger>
          {/* --------------- 홈  ---------------  */}
          <OverlayTrigger
            delay={{ hide: 5, show: 5 }}
            overlay={(props) => (
              <Tooltip {...props} className="mytooltip">
                홈으로 가기
              </Tooltip>
            )}
            placement="right"
          >
            <div
              className={`home channel ${storeSelectedChannel === -2 ? "selected-new" : ""}`}
              onClick={() => selectChannel(-2)}
            >
              <img src={logo} alt="logo" className="logo" />
              <div className="overlay-channel" />
            </div>
          </OverlayTrigger>

          {storeChannelList.map((channel) => {
            return <ChannelComponent info={channel} key={channel.id} />;
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
            <button
              className={`channel create-channel ${
                storeSelectedChannel === -3 ? "selected-new" : ""
              }`}
              onClick={() => createNewChannel()}
            >
              <i className="fal fa-plus fa-2x" />
              <div className="overlay-channel" />
            </button>
          </OverlayTrigger>
        </nav>
      </div>
      {/* 스터디 생성 모달 */}
      <ChannelCreateModal show={modalShow} onHide={() => setModalShow(false)} />

    </div>
  );
};

export default SideBarChannel;
