import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../config/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [roles, setRoles] = useState("User");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        const userData = isSignUp
            ? {
                name: name,
                email: email,
                password: password,
                role: roles
            }
            : {
                email: email,
                password: password
            };

        console.log('Making request to:', isSignUp ? '/auth/register' : '/auth/login');
        console.log('With data:', userData);

        const response = await api.post(
            isSignUp ? '/auth/register' : '/auth/login',
            userData
        );

        console.log('Response received:', response.data);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setName(response.data.user.name);
            setEmail(response.data.user.email);
            setPassword("");
            setRoles(response.data.user.role);
            toast.success(response.data.message);

            // Get user role from response
            const userRole = response.data.user?.role;
            console.log('User role from response:', userRole);

            if (userRole) {
                if (userRole === 'Admin') {
                    navigate('/admin-dashboard', { replace: true });
                } else if (userRole === 'User') {
                    navigate('/user-dashboard', { replace: true });
                } else if (userRole === 'Staff') {
                    navigate('/staff-dashboard', { replace: true });
                } else {
                    console.error('Invalid user role:', userRole);
                    toast.error('Invalid user role');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                console.error('No role found in response');
                toast.error('No role found in response');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    } catch (error) {
        console.error('Login/Register error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data?.message || 'An error occurred';
            toast.error(errorMessage);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            toast.error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
            toast.error('Error setting up request');
        }
    }
  };

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }

    if (isSignUp && !name) {
      toast.error("Please enter your name.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <p className="text-lg font-medium text-black">Role</p>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => setRoles(e.target.value)}
                value={roles}
                required
                disabled={loading}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
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
            <p className="text-center">
              Already have an account?{" "}
              <span
                onClick={() => !loading && toggleForm(false)}
                className={`text-blue-600 cursor-pointer hover:underline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
            <p className="text-center">
              Don't have an account?{" "}
              <span
                onClick={() => !loading && toggleForm(true)}
                className={`text-blue-600 cursor-pointer hover:underline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Register here
              </span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;