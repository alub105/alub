import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import "./App.css";
import "./static/css/bootstrap.min.css";
import Channel from "./component/Channel/Channel";
import LandingPage from "./component/LandingPage/LandingPage";
import Authenticate from "./component/Authenticate/Authenticate";
import CodeView from "./component/CodeView/CodeView";
import NotFound from "./component/error/NotFound";

function App() {
  return (
    <>
      <Router>
        <main>
          <Switch>
            <Route path="/" exact={true} component={LandingPage} />
            <Route path="/channel" exact={true} component={Channel} />
            <Route path="/channel/:channelId/home" exact={true} component={Channel} />
            <Route path="/channel/:channelId/study/:studyId" exact={true} component={Channel} />
            <Route path="/channel/:channelId/setting" exact={true} component={Channel} />
            <Route path="/oauth/redirect" component={Authenticate} />
            <Route path="/codeview/:channelId" component={CodeView} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
