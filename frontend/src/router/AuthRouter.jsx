import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PageLoader from '@/components/PageLoader';

const Login = lazy(() => import(`@/pages/Login.jsx`));

const NotFound = lazy(() => import(`@/pages/NotFound.jsx`));

const Register = lazy(() => import(`@/pages/Register.jsx`));

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
        path="/"
      />
      <Route
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
        path="/login"
      />
      <Route
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <Register />
            </Suspense>
          </PublicRoute>
        }
        path="/register"
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
