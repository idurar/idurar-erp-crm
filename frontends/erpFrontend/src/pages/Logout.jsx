import React, { useEffect, useCallback } from 'react';
import { Button, Result } from 'antd';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/redux/auth/actions';
import PageLoader from '@/components/PageLoader';

const Logout = () => {
  const dispatch = useDispatch();
  function asyncLogout() {
    return dispatch(logoutAction());
  }
  useEffect(() => {
    asyncLogout();
  }, []);

  return <PageLoader />;
};
export default Logout;
