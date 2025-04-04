import React from "react";

import backgroundImage from "../assets/background.jpg";

const Header = () => {
  return (
    <div
      className="min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container text-center mx-auto py-12 px-6 md:px-20 lg:px-32 text-white">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight pt-20 mb-6">
          Get Yourself and Others Vaccinated
        </h2>
        <p className="text-lg sm:text-xl mb-8">
          Register for your vaccination today and protect yourself and others.
          Easily find nearby centers and book an appointment in minutes. Don't
          wait—your health and safety are just a click away!
        </p>

        <div className="space-x-4 mt-8">
          <a
            href="#speciality"
            className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
