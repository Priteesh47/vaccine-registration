import React from 'react';
import { vaccines } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Vaccines = () => {
  const navigate = useNavigate();

  return (
    <section id="vaccines" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Available Vaccines
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a wide range of vaccines to protect you and your loved ones against various diseases.
          </p>
        </div>

        {/* Preview Grid - Show only first 3 vaccines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vaccines.slice(0, 3).map((vaccine) => (
            <div
              key={vaccine._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Vaccine Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={vaccine.image}
                  alt={vaccine.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {vaccine.name}
                </h3>
              </div>

              {/* Vaccine Preview */}
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                  {vaccine.speciality}
                </span>
                <p className="text-gray-600 mb-4 line-clamp-2">{vaccine.description}</p>
                <button
                  onClick={() => navigate('/vaccines')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/vaccines')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            View All Vaccines
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Vaccines; 