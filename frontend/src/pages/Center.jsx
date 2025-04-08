import React, { useEffect, useState } from "react";
import api from "../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Center = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await api.get("/centers");
      setCenters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error("Failed to fetch vaccination centers");
      setLoading(false);
    }
  };

  const handleBookAppointment = (center) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    // If user is logged in, navigate to dashboard and open appointment modal
    navigate("/user-dashboard", {
      state: {
        openAppointmentModal: true,
        selectedCenter: center,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Vaccination Centers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div
              key={center._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {center.name}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span> {center.address}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {center.phone}
                </p>
              </div>
              <button
                onClick={() => handleBookAppointment(center)}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Center;
