import { Link } from 'react-router-dom';

function LoginForm() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        {/* Existing email + password inputs */}
        <button type="submit">Login</button>

        {/* 🆕 Add this line */}
        <p className="text-sm mt-3">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
