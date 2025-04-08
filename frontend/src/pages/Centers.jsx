import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Centers = () => {
  const navigate = useNavigate();
  const { Centers, isAuthenticated } = useContext(AppContext);

  const handleBookAppointment = (centerId) => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/appointment/${centerId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vaccination Centers</h1>
      
      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Centers.map((center, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={assets[`cen${index + 1}`]}
                alt={center.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {center.name}
              </h2>
              <p className="text-gray-600 mb-4">{center.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{center.address}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{center.email}</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Available Vaccines:</h3>
                <div className="flex flex-wrap gap-2">
                  {center.vaccines.map((vaccine, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {vaccine}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleBookAppointment(index + 1)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Centers; 