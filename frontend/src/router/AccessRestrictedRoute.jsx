import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { adminHasCreateAccess, adminHasDeleteAccess, adminHasEditAccess } from '@/utils/helpers';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AccessRestrictedRoute = ({ type = 'edit', children }) => {
  const currentAdmin = useSelector(selectCurrentAdmin);

  if (currentAdmin) {
    if (type === 'edit' && !adminHasEditAccess(currentAdmin)) return <Navigate to="/" replace />;
    else if (type === 'create' && !adminHasCreateAccess(currentAdmin))
      return <Navigate to="/" replace />;
    else if (type === 'delete' && !adminHasDeleteAccess(currentAdmin))
      return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AccessRestrictedRoute;
