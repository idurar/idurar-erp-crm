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
import useNetwork from "./useNetwork";

function App() {
  // const [isOnline, setNetwork] = useState(true);

  // notification.config({
  //   duration: 30,
  // });

  // window.ononline = (event) => {
  //   setNetwork(true);
  // };

  // window.onoffline = (event) => {
  //   setNetwork(false);
  // };

  // useEffect(() => {
  //   if (isOnline) {
  //     console.log("network is Connected ");
  //   } else {
  //     notification.error({
  //       message: "No internet connection",
  //       description:
  //         "Cannot connect to the server, Check your internet network",
  //     });
  //   }
  // }, [isOnline]);
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
