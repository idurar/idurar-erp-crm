// export { default as AuthRouter } from "./AuthRouter";
// export { default as AppRouter } from "./AppRouter";
import React, { useEffect } from "react";

import AuthRouter from "./AuthRouter";
import AppRouter from "./AppRouter";

import { Layout } from "antd";
import Navigation from "@/layout/Navigation";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

export default function Router() {
  const { isLoggedIn } = useSelector(selectAuth);

  useEffect(() => {
    console.log("isLoggedIn : ", isLoggedIn);
  }, [isLoggedIn]);

  if (isLoggedIn === false)
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <AuthRouter />
      </Layout>
    );
  else
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navigation />
        <Layout style={{ minHeight: "100vh" }}>
          <AppRouter />
        </Layout>
      </Layout>
    );
}

// export default App;
