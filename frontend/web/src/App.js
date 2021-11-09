import React from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

import "./App.css";
import "./static/css/bootstrap.min.css";
import ChannelTemplate from "./component/ChannelTemplate/ChannelTemplate";
import Authenticate from "./component/Authenticate/Authenticate";
import NotFound from "./component/error/NotFound";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={ChannelTemplate} />
        <Route path="/oauth/redirect" component={Authenticate} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
