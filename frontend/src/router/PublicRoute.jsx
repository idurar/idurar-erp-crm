import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the admin is logged in
    // Otherwise, redirect the admin to /signin page
    <Route
      {...rest}
      render={(props) =>
        window.localStorage.getItem('isLoggedIn') ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
