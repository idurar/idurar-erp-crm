import React, { Children, useContext } from "react";
import AppContext from "../../store/AppContext";
import { Redirect, Route } from "react-router-dom";
import AnimatedRoute from "./AnimatedRoute";

export default function AuthRoute({ children, ...rest }) {
  const [isLoggedIn] = useContext(AppContext);

  if (isLoggedIn) return <AnimatedRoute {...rest}>{children}</AnimatedRoute>;

  return (
    <AnimatedRoute>
      <Redirect to="/login" />;
    </AnimatedRoute>
  );
}
