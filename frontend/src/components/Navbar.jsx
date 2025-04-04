import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-orange-500 rounded-full"></div>
          <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>
          <span className="font-semibold text-indigo-600 text-xl">Vaccino</span>
        </div>

        <nav className="flex-1">
          <ul className="flex justify-center space-x-8">
            <NavLink
              to="/"
              className="text-indigo-600 text-lg font-medium hover:text-orange-400 transition-colors duration-200"
            >
              <li>Home</li>
            </NavLink>

            <NavLink
              to="/vaccines"
              className="text-indigo-600 text-lg font-medium hover:text-orange-400 transition-colors duration-200"
            >
              <li>Vaccines</li>
            </NavLink>

            <NavLink
              to="/center"
              className="text-indigo-600 text-lg font-medium hover:text-orange-400 transition-colors duration-200"
            >
              <li>Center</li>
            </NavLink>

            <NavLink
              to="/contact"
              className="text-indigo-600 text-lg font-medium hover:text-orange-400 transition-colors duration-200"
            >
              <li>Contact</li>
            </NavLink>

            <NavLink
              to="/about"
              className="text-indigo-600 text-lg font-medium hover:text-orange-400 transition-colors duration-200"
            >
              <li>About</li>
            </NavLink>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {token ? (
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
                    onClick={() => setToken(false)}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-lg transition-colors duration-300"
            >
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
