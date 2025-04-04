import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roles, setRoles] = useState("User");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const userData = isSignUp 
      ? { email, password, name, roles }
      : { email, password };

    try {
      const endpoint = isSignUp ? "/users/signup" : "/users/login";
      console.log('Making request to:', endpoint);
      console.log('With data:', userData);

      const response = await api.post(endpoint, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Response:', response.data);

      if (response.data.success) {
        // Store user data and token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Show success message
        alert(isSignUp ? "Account created successfully!" : "Login successful!");

        // Redirect based on role
        if (response.data.user.roles === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setError(error.response.data.message || "An error occurred during login");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return false;
    }

    if (isSignUp && !name) {
      setError("Please enter your name.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const toggleForm = (isSignUpState) => {
    setIsSignUp(isSignUpState);
    setEmail("");
    setPassword("");
    setName("");
    setRoles("User");
    setError("");
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100 font-[Outfit]">
      <div className="w-full md:w-1/2 h-screen">
        <img
          src={assets.login}
          alt="Login"
          className="w-full h-full object-cover rounded-lg shadow-xl"
        />
      </div>

      {isSignUp ? (
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 text-gray-900 bg-blue-100">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
            Create an Account
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <p className="text-lg font-medium text-black">Name</p>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                disabled={loading}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-black">Email</p>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                disabled={loading}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-black">Password</p>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                disabled={loading}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-black">Roles</p>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setRoles(e.target.value)}
                value={roles}
                required
                disabled={loading}
              >
                <option value="User">User</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <button
              type="submit"
              className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Create an Account'}
            </button>
            <p>
              Already have an account?{" "}
              <span
                onClick={() => !loading && toggleForm(false)}
                className={`text-primary cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      ) : (
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 text-gray-900 bg-blue-100">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
            Login Here
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <p className="text-lg font-medium text-black">Email</p>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                disabled={loading}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-black">Password</p>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => !loading && toggleForm(true)}
                className={`text-primary cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Sign up here
              </span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;