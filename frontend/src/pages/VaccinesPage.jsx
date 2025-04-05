import React from 'react';
import { vaccines } from '../assets/assets';

const VaccinesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Vaccines</h1>
          <p className="mt-2 text-gray-600">Browse and learn about our comprehensive vaccine offerings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Vaccines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vaccines.map((vaccine) => (
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

              {/* Vaccine Details */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {vaccine.speciality}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {vaccine.description}
                </p>

                <div className="space-y-2">
                  {/* Manufacturer */}
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-sm">{vaccine.manufacturer}</span>
                  </div>

                  {/* Dosage */}
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <span className="text-sm">{vaccine.dosage}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {vaccine.features.split('. ').map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Now Button */}
                <div className="mt-6">
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  >
                    <span>Book Appointment</span>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VaccinesPage; 