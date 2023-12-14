import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import Verify from '@/pages/Verify';
import ForgetPassword from '@/pages/ForgetPassword';
import ResetPassword from '@/pages/ResetPassword';

export default function AuthRouter() {
  return (
    <Routes>
      <Route element={<Register />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Navigate to="/login" replace />} path="/logout" />
      <Route element={<Register />} path="/register" />
      <Route element={<ForgetPassword />} path="/forgetpassword" />
      <Route element={<Verify />} path="/verify/:userId/:emailToken" />
      <Route element={<ResetPassword />} path="/resetpassword/:userId/:resetToken" />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
