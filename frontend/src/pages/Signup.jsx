import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;