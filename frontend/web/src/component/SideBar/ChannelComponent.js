/* eslint-disable */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedChannel } from "../../modules/actions/study";

const ChannelComponent = ({ info, selectChannel, selectId, setClicked }) => {
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
              info.id === selectId ? "selected" : ""
            }`}
            onClick={() => setClicked(info.id)}
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
