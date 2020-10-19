import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import StorePicker from './views/StorePicker'
import NotFound from "./views/NotFound";
import DashboardPage from "./views/DashboardPage";
import LoginPage from "./views/LoginPage";
import "./App.less";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
