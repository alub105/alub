import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import "./App.css";
import "./static/css/bootstrap.min.css";
import Channel from "./component/Channel/Channel";
import LandingPage from "./component/LandingPage/LandingPage";
import Authenticate from "./component/Authenticate/Authenticate";
import NotFound from "./component/error/NotFound";

function App() {
  return (
    <>
      <Router>
        <main>
          <Switch>
            <Route path="/" exact={true} component={LandingPage} />
            <Route path="/channel" component={Channel} />
            <Route path="/oauth/redirect" component={Authenticate} />
            <Route path="/path" component={Authenticate} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
