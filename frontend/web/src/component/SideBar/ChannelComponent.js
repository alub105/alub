/* eslint-disable */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import * as studyActions from "../../modules/actions/study";

const ChannelComponent = ({ info, selectChannel }) => {
  const dispatch = useDispatch();
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);

  return (
    <div>
      <OverlayTrigger
        delay={{ hide: 1, show: 1 }}
        overlay={(props) => (
          <Tooltip {...props} className="mytooltip">
            {info.name} 채널
          </Tooltip>
        )}
        placement="right"
      >
        <div
          className={`exist-channel channel ${storeSelectedChannel === info.id ? "selected" : ""}`}
          onClick={() => selectChannel(info.id)}
        >
          {info.name}
          <div className="overlay-channel" />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default ChannelComponent;
