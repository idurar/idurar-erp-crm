import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import PageLoader from '@/components/PageLoader';
import { routesConfig } from './RoutesConfig';

const Logout = lazy(() => import(/*webpackChunkName:'LogoutPage'*/ '@/pages/Logout'));
const NotFound = lazy(() => import(/*webpackChunkName:'NotFoundPage'*/ '@/pages/NotFound'));

const SubMenuRouter = ({ subMenuRouter }) => {
  subMenuRouter.map((subMenu) => {
    console.log('🚀 ~ file: AppRouter.jsx ~ line 25 ~ routeItem.hasSubMenu.map ~ subMenu', subMenu);

    return (
      <PrivateRoute
        key={subMenu.component}
        path={subMenu.path}
        exact={subMenu.exact || true}
        component={lazy(() =>
          import(/* webpackChunkName: "[request]" */ `@/pages/${subMenu.component}`)
        )}
      />
    );
  });
};

export default function AppRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          {routesConfig.map((routeItem) => {
            return (
              <PrivateRoute
                key={routeItem.component}
                path={routeItem.path}
                exact={routeItem.exact || true}
                component={lazy(() =>
                  import(/* webpackChunkName: "[request]" */ `@/pages/${routeItem.component}`)
                )}
              />
            );
          })}
          <PublicRoute path="/login" render={() => <Redirect to="/" />} exact />
          <Route component={Logout} path="/logout" exact />
          <Route path="*" component={NotFound} render={() => <Redirect to="/notfound" />} />
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}
