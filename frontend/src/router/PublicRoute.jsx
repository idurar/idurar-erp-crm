import { Navigate } from 'react-router-dom';

import storePersist from '@/redux/storePersist';

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = storePersist.get('auth')
    ? storePersist.get('auth')
    : { isLoggedIn: false };
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  } else return <>{children}</>;
};

export default PublicRoute;
