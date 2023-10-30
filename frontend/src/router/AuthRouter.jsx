import { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PublicRoute from './PublicRoute';
import PageLoader from '@/components/PageLoader';

const Login = lazy(() => import(/* webpackChunkName: "[request]" */ `@/pages/Login.jsx`));

const NotFound = lazy(() => import(/* webpackChunkName: "[request]" */ `@/pages/NotFound.jsx`));

const Register = lazy(() => import(/* webpackChunkName: "[request]" */ `@/pages/Register.jsx`));

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <PublicRoute path="/" component={Login} render={() => <Redirect to="/login" />} exact />
          <PublicRoute component={Login} path="/login" exact />
          <PublicRoute component={Register} path="/register" exact />
          <Route path="*" component={NotFound} render={() => <Redirect to="/notfound" />} />
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}
