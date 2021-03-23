import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../config/serverApiConfig";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem(ACCESS_TOKEN_NAME) && restricted ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PublicRoute;
