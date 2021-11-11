import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const ChannelTemplate = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const history = useHistory();
  useEffect(() => {
    if (!storeToken) {
      history.push("/");
    }
  }, [storeToken]);
  return (
    <div>
      <h1>Channel</h1>
      <p>로그인 성공!</p>
    </div>
  );
};

export default ChannelTemplate;
