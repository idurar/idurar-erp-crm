import { Routes, Route, useLocation } from 'react-router-dom';

import Login from '@/pages/Login';

import NotFound from '@/pages/NotFound';

import Register from '@/pages/Register';

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<Login />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
