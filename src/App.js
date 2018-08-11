import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import About from "./components/pages/About";

const App = () => (
  <Router>
    <Fragment>
      <Route exact path="/" component={Landing} />
      <Route exact path="/about" component={About} />
    </Fragment>
  </Router>
);

export default App;
