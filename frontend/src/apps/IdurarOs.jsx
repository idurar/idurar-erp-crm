import { lazy, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import PageLoader from '@/components/PageLoader';

// import AuthRouter from '@/router/AuthRouter';

// const Localization = lazy(() => import('@/locale/Localization'));

import Localization from '@/locale/Localization';

const ErpApp = lazy(() => import('./ErpApp'));
const AuthRouter = lazy(() => import('@/router/AuthRouter'));

export default function IdurarOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn)
    return (
      <Localization>
        <Suspense fallback={<PageLoader />}>
          <AuthRouter />
        </Suspense>
      </Localization>
    );
  else {
    return (
      <Localization>
        <AppContextProvider>
          <Suspense fallback={<PageLoader />}>
            <ErpApp />
          </Suspense>
        </AppContextProvider>
      </Localization>
    );
  }
}
