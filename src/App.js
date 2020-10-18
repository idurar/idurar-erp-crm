import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import StorePicker from './views/StorePicker'
import NotFound from "./views/NotFound";
import Dashboard from "./views/Dashboard";
import "./App.less";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
