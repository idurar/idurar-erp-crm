import TaxPage from '@/pages/TaxPage';
import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';

import routes from './routes';

export default function AppRouter() {
  const location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { app } = appContextAction;

  // Flatten all route arrays into one array
  const routesList = Object.values(routes).flat();

  // Helper to find app name by current path
  function getAppNameByPath(path) {
    for (const key in routes) {
      if (routes[key].some(route => route.path === path)) {
        return key;
      }
    }
    return 'default';
  }

  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [location.pathname, app]);

  // Generate router element from routes list
  const element = useRoutes(routesList);

  return element;
}
