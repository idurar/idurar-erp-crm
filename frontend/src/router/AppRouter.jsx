// }

import { useLayoutEffect, lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import PageLoader from '@/components/PageLoader';
import { useDispatch } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { routesConfig } from './RoutesConfig';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

// const SubMenuRouter = ({ subMenuRouter }) => {
//   subMenuRouter.map((subMenu) => {
//     return (
//       <PrivateRoute
//         key={subMenu.component}
//         path={subMenu.path}
//         exact={subMenu.exact || true}
//         component={lazy(() =>
//           import(/* webpackChunkName: "[request]" */ `@/pages/${subMenu.component}`)
//         )}
//       />
//     );
//   });
// };

export default function AppRouter() {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch location={location} key={location.pathname}>
        {routesConfig.map((routeItem) => {
          return (
            <PrivateRoute
              key={routeItem.component}
              path={routeItem.path}
              exact={routeItem.exact || true}
              component={lazy(() => import(`../pages/${routeItem.component}.jsx`))}
            />
          );
        })}
        <PublicRoute path="/login" render={() => <Redirect to="/" />} exact />
        <Route component={Logout} path="/logout" exact />
        <Route path="*" component={NotFound} render={() => <Redirect to="/notfound" />} />
      </Switch>
    </Suspense>
  );
}
