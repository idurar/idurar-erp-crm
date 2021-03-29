import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";

import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Days from "./pages/Days";
import Customer from "./pages/Customer";
import Patient from "./pages/Patient";
import AntdForm from "./pages/AntdForm";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import "./App.less";

function App() {
  // const [userData, setUserData] = useState({
  //   token: undefined,
  //   user: undefined,
  // });
  return (
    <Switch>
      <PrivateRoute path="/" component={Dashboard} exact />
      <PrivateRoute component={Customer} path="/customer" exact />
      <PrivateRoute component={Patient} path="/patient" exact />
      <PrivateRoute component={Days} path="/days" exact />
      <PrivateRoute component={AntdForm} path="/antd" exact />
      <PrivateRoute component={Logout} path="/logout" exact />
      <PublicRoute component={Login} path="/login" exact />
      <Route
        path="*"
        component={NotFound}
        render={() => <Redirect to="/notfound" />}
      />
    </Switch>
  );
}

export default App;
