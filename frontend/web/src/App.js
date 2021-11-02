import React from "react";
import { Route } from "react-router-dom";

import "./App.css";
import Home from "./component/Home";
import Authenticate from "./component/Authenticate";

function App() {
  return (
    <div className="App">
      <Route path="/" exact={true} component={Home}></Route>
      <Route path="/oauth/redirect" component={Authenticate} />
    </div>
  );
}

export default App;
