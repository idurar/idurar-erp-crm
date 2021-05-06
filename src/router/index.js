import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";

const routes = [
  {
    path: "/",
    name: "Framer Motion",
    // component: lazy(() => import("@/pages/Dashboard")),
  },
];
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Patient = lazy(() => import("@/pages/Patient"));
const Customer = lazy(() => import("@/pages/Customer"));
const Login = lazy(() => import("@/pages/Login"));
const Logout = lazy(() => import("@/pages/Logout"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <PrivateRoute path="/" component={Dashboard} exact />
          <PrivateRoute component={Customer} path="/customer" exact />
          <PrivateRoute component={Patient} path="/patient" exact />
          <PrivateRoute component={Logout} path="/logout" exact />
          <PublicRoute component={Login} path="/login" exact />
          <Route path="/loader" component={PageLoader} />
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

export default Router;
