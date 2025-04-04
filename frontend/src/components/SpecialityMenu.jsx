import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      className="bg-gray-100 py-12 px-6 md:px-16 lg:px-24 text-center"
      id="speciality"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
        Find by Speciality
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
        Find vaccines by disease and get protected with ease. Whether it’s flu,
        hepatitis, or COVID-19, locate the right vaccine, check availability,
        and book your appointment in seconds.
      </p>

      <div className="flex flex-wrap justify-center items-center gap-4">
        {specialityData.map((item) => (
          <Link
            key={item.speciality}
            to={`/vaccines/${item.speciality}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-lg transition-all duration-300 w-32"
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-20 h-20 object-cover rounded-full mb-2"
            />
            <p className="text-gray-700 text-sm font-medium">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
