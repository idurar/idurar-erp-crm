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
    <Suspense fallback={<PageLoader />}>
      <Routes location={location} key={location.pathname}>
        <Route
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          path="/"
        />
        <Route
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          path="/login"
        />
        <Route
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
          path="/register"
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
