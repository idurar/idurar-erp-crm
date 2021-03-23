import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../config/serverApiConfig";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem(ACCESS_TOKEN_NAME) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
