import React, { useEffect } from "react";

import AuthRouter from "./AuthRouter";
import AppRouter from "./AppRouter";

import { Layout } from "antd";
import Navigation from "@/components/Navigation";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

export default function Router() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn) return <AuthRouter />;
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
