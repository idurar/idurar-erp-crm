import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserContext from "./context/UserContext";
import PrivateRoute from "./utils/PrivateRoute";

import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import DaysPage from "./pages/DaysPage";
import CustomerPage from "./pages/CustomerPage";
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
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Switch>
            <PrivateRoute component={DashboardPage} path="/" exact />
            <PrivateRoute component={CustomerPage} path="/customer" exact />
            <PrivateRoute component={DaysPage} path="/days" exact />
            <PrivateRoute component={AntdForm} path="/antd" exact />

            <Route path="/login" component={LoginPage} />
            {/* <Route path="/register" component={Register} /> */}
            <Route component={NotFound} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
