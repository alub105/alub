import React, { useEffect } from "react";
import "./Authenticate.scoped.css";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../../modules/user";

const Authenticate = () => {
  const token = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(token);
    if (token === "") {
      console.log("not exist token");
      dispatch(setToken("eunsong-token"));
    } else {
      console.log("exist token");
    }
  }, []);

  return (
    <div className="authenticate">
      <div className="container">
        <h1 className="title">Authenticate</h1>
      </div>
    </div>
  );
};

export default Authenticate;
