import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import PrivateRoute from "./utils/PrivateRoute";

import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import DaysPage from "./pages/DaysPage";
import CustomerPage from "./pages/CustomerPage";
import PatientPage from "./pages/PatientPage";
import AntdForm from "./pages/AntdForm";
import LoginPage from "./pages/LoginPage";
import "./App.less";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  return (
    <>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Switch>
          <PrivateRoute path="/" component={DashboardPage} exact />
          <PrivateRoute component={CustomerPage} path="/customer" exact />
          <PrivateRoute component={PatientPage} path="/patient" exact />
          <PrivateRoute component={DaysPage} path="/days" exact />
          <PrivateRoute component={AntdForm} path="/antd" exact />

          <Route path="/login" component={LoginPage} />
          {/* <Route path="/register" component={Register} /> */}
          <Route
            path="*"
            component={NotFound}
            render={() => <Redirect to="/notfound" />}
          />
        </Switch>
      </UserContext.Provider>
    </>
  );
}

export default App;
