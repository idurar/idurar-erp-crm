import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";

import Customer from "@/pages/Customer";
import Patient from "@/pages/Patient";

import Login from "@/pages/Login";
import Logout from "@/pages/Logout";

function Router() {
  return (
    <Switch>
      <PrivateRoute path="/" component={Dashboard} exact />
      <PrivateRoute component={Customer} path="/customer" exact />
      <PrivateRoute component={Patient} path="/patient" exact />
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

export default Router;
