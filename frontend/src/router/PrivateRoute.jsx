import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the admin is logged in
    // Otherwise, redirect the admin to /signin page

    <Route
      {...rest}
      render={(props) =>
        window.localStorage.getItem('isLoggedIn') ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
