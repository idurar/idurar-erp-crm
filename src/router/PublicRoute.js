import React from "react";
import { Route, Redirect } from "react-router-dom";
import * as authService from "@/auth";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        authService.token.get() ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
