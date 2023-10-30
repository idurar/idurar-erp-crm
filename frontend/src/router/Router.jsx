import { lazy, Suspense } from 'react';

import PageLoader from '@/components/PageLoader';

const AppRouter = lazy(() => import(`./AppRouter`));
const AuthRouter = lazy(() => import(`./AuthRouter`));

export default function Router({ isLoggedIn = false }) {
  if (!isLoggedIn)
    return (
      <Suspense fallback={<PageLoader />}>
        {' '}
        <AuthRouter />
      </Suspense>
    );
  else
    return (
      <Suspense fallback={<PageLoader />}>
        <AppRouter />
      </Suspense>
    );
}
