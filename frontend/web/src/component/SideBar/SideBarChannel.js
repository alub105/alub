/* eslint-disable */
import React, { useEffect, useCallback } from "react";
import "./SideBarChannel.scoped.scss";
import logo from "../../static/image/logo.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as studyActions from "../../modules/actions/study";

import ChannelComponent from "./ChannelComponent";
import ChannelCreateModal from "../Modal/ChannelCreateModal";

const SideBarChannel = ({ match }) => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);

  const { channelList: storeChannelList } = useSelector((state) => state.study);
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
  const { userInfo: storeUserInfo } = useSelector((state) => state.user);

  const history = useHistory();

  useEffect(() => {
    // console.log("studybar 1", match);
    // if (match.url === "/channel/profile") {
    //   history.push("/channel/profile");
    // }
  }, [storeChannelList, storeSelectedChannel]);

  const selectChannel = (value) => {
    if (value === -1) {
      history.push(`/channel/profile`);
    } else if (value > 0) {
      dispatch(studyActions.setSelectedChannel(value));
      history.push(`/channel/${value}/home`);
    }
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

          {storeChannelList.map((channel, index) => {
            return <ChannelComponent info={channel} key={index} selectChannel={selectChannel} />;
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
