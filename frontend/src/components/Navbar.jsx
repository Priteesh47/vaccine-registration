import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isLoggedIn && user) {
      // Navigate to appropriate dashboard based on role
      if (user.role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'Staff') {
        navigate('/staff-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      // Navigate to home if not logged in
      navigate('/');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="h-8 w-8 bg-orange-500 rounded-full"></div>
          <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>
          <span className="font-semibold text-indigo-600 text-xl">Vaccino</span>
        </div>

        {!isLoggedIn ? (
          <>
            <nav className="flex-1">
              <ul className="flex justify-center space-x-8">
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-indigo-600 hover:text-orange-400'
                    }`
                  }
                >
                  <li>Home</li>
                </NavLink>

                <NavLink
                  to="/vaccines"
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-indigo-600 hover:text-orange-400'
                    }`
                  }
                >
                  <li>Vaccines</li>
                </NavLink>

                <NavLink
                  to="/center"
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-indigo-600 hover:text-orange-400'
                    }`
                  }
                >
                  <li>Center</li>
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-indigo-600 hover:text-orange-400'
                    }`
                  }
                >
                  <li>Contact</li>
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-indigo-600 hover:text-orange-400'
                    }`
                  }
                >
                  <li>About</li>
                </NavLink>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-lg transition-colors duration-300"
              >
                Login
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer group relative"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img className="w-8 rounded-full" src={assets.profile} alt="" />
              <img className="w-2.5" src={assets.dropdown} alt="" />

              {showMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-lg py-2 px-4 text-base font-medium text-gray-600 z-20">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
