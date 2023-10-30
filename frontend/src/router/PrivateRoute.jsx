import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  if (window.localStorage.getItem('isLoggedIn')) {
    return <>{children}</>;
  } else return <Navigate to="/login" replace />;
};

export default PrivateRoute;
