import React, { useContext } from "react";
import AppContext from "../../store/AppContext";
import { Redirect, Route } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedRoute from "./AnimatedRoute";

export default function GuestRoute({ children, ...rest }) {
  const [isLoggedIn] = useContext(AppContext);

  if (!isLoggedIn) return <AnimatedRoute {...rest}>{children}</AnimatedRoute>;

  return (
    <AnimatedRoute>
      <Redirect to="/" />;
    </AnimatedRoute>
  );
}
