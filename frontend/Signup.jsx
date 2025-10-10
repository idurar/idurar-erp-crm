import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) {
      return 'All fields are required';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // add more password strength rules if needed
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      console.log('Signup success:', res.data);
      // You may want to store token / user in context / redux
      // Then redirect to dashboard or login
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response || err);
      const msg = err.response?.data?.message || 'Error occurred';
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          { loading ? 'Signing up...' : 'Sign Up' }
        </button>
      </form>

      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Signup;

