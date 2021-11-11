import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SideBarChannel from "../SideBar/SideBarChannel";
import SideBarStudy from "../SideBar/SideBarStudy";

const Channel = () => {
  const { token: storeToken } = useSelector((state) => state.user);
  const history = useHistory();
  useEffect(() => {
    console.log(storeToken);
    if (!storeToken || storeToken === "") {
      console.log("no token ", storeToken);
      history.push("/");
    }
  }, []);

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
