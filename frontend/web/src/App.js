import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import "./App.css";
import "./static/css/bootstrap.min.css";
import ChannelTemplate from "./component/ChannelTemplate/ChannelTemplate";
import LandingPage from "./component/LandingPage/LandingPage";
import Authenticate from "./component/Authenticate/Authenticate";
import NotFound from "./component/error/NotFound";

function App() {
  return (
    <Router>
      <main>
        <Switch>
          <Route path="/" exact={true} component={LandingPage} />
          <Route path="/channel" exact={true} component={ChannelTemplate} />
          <Route path="/oauth/redirect" component={Authenticate} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
