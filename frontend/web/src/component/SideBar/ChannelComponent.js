/* eslint-disable */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChannelComponent = ({ info, selectChannel }) => {
  const { selectedChannel: storeSelectedChannel } = useSelector(
    (state) => state.study
  );

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
        <Link to={`/channel/${info.id}`}>
          <div
            className={`exist-channel channel ${
              storeSelectedChannel === info.id ? "selected" : ""
            } `}
            // className={`exist-channel channel`}
            onClick={() => selectChannel(info.id)}
          >
            {info.name}
            <div className="overlay-channel" />
          </div>
        </Link>
      </OverlayTrigger>
    </div>
  );
};

export default ChannelComponent;
