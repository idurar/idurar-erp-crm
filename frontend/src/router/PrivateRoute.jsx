import { Navigate } from 'react-router-dom';
import storePersist from '@/redux/storePersist';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = storePersist.get('auth')
    ? storePersist.get('auth')
    : { isLoggedIn: false };
  if (isLoggedIn) {
    return <>{children}</>;
  } else return <Navigate to="/login" replace />;
};

export default PrivateRoute;
