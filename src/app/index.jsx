import React, { useEffect, useState, Suspense } from "react";
import { Router as RouterHistory } from "react-router-dom";
import { Provider } from "react-redux";
import Router from "@/router";
import history from "@/utils/history";
import store from "@/redux/store";
import { notification, Layout } from "antd";
import Navigation from "@/components/Navigation";
import { Button, Result } from "antd";
import * as authService from "@/auth";
import useNetwork from "@/hooks/useNetwork";

function App() {
  const { isOnline } = useNetwork();

  if (!isOnline)
    return (
      <>
        <Result
          status="404"
          title="No Internet Connection"
          subTitle="Check your Internet Connection or your network."
          extra={
            <Button href="/" type="primary">
              Try Again
            </Button>
          }
        />
      </>
    );
  else
    return (
      <RouterHistory history={history}>
        <Provider store={store}>
          <Layout style={{ minHeight: "100vh" }}>
            {authService.token.get() ? <Navigation /> : ""}
            <Layout style={{ minHeight: "100vh" }}>
              <Router />
            </Layout>
          </Layout>
        </Provider>
      </RouterHistory>
    );
}

export default App;
