import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopVaccines = () => {
  const navigate = useNavigate();
  const { vaccines } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-semibold text-center">
        Different Available Vaccinations
      </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Browse Vaccines according to your needs
      </p>

      {vaccines.length === 0 ? (
        <p className="text-center text-gray-600">Loading vaccines...</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0 pt-5">
          {vaccines.slice(0, 10).map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300"
              key={index}
            >
              <div className="w-full h-48 bg-blue-50 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-sm font-medium text-green-700">
                    Available
                  </p>
                </div>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.dosage}</p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          navigate("/vaccines");
          scrollTo(0, 0); // Ensure scroll to top on button click
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
        aria-label="View more available vaccines"
      >
        More
      </button>
    </div>
  );
};

export default TopVaccines;
