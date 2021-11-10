import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const ChannelTemplate = () => {
  const { token: storeToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (storeToken === "") {
      console.log("no auth");
      <Redirect to="/login" />;
    }
  }, []);
  return (
    <div>
      <h1>Channel</h1>
      <p>로그인 성공!</p>
    </div>
  );
};

export default ChannelTemplate;
