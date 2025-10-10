import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Header;
