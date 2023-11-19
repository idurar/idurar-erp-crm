import usePermission from '@/hooks/usePermission';
import { accessTypes } from '@/utils/constants';
import React from 'react';
import { Navigate } from 'react-router-dom';

const AccessRestrictedRoute = ({ type = accessTypes.EDIT, children }) => {
  const { hasPermission } = usePermission();

  if (type === accessTypes.EDIT && !hasPermission(accessTypes.EDIT))
    return <Navigate to="/" replace />;
  else if (type === accessTypes.CREATE && !hasPermission(accessTypes.CREATE))
    return <Navigate to="/" replace />;
  else if (type === accessTypes.DELETE && !hasPermission(accessTypes.DELETE))
    return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AccessRestrictedRoute;
