import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";

const Login = lazy(() =>
  import(/*webpackChunkName:'LoginPage'*/ "@/pages/Login")
);

const NotFound = lazy(() =>
  import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
);

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <PublicRoute
            path="/"
            component={Login}
            render={() => <Redirect to="/login" />}
          />
          <PublicRoute component={Login} path="/login" exact />
          <Route
            path="*"
            component={NotFound}
            render={() => <Redirect to="/notfound" />}
          />
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}
