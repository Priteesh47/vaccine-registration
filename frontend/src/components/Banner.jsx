import React from "react";

import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:p-12 my-20 md:mx-10">
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white leading-tight">
          <p>Book your appointments</p>
          <p className="mt-4">Best Online Platform related to Vaccinations</p>
        </h1>

        <button
          onClick={() => {
            navigate("/login");
            window.scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 font-medium hover:scale-105 transition-all"
        >
          Create Account
        </button>
      </div>

      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        {assets.appointment ? (
          <img
            className="w-full absolute bottom-0 right-0 max-w-md"
            src={assets.appointment}
            alt="Appointment Banner"
          />
        ) : (
          <p className="text-white"></p>
        )}
      </div>
    </div>
  );
};

export default Banner;
