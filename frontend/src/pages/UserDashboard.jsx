import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // States for different sections
  const [vaccineStats, setVaccineStats] = useState({
    totalVaccines: 0,
    completedVaccines: 0,
    upcomingVaccines: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentVaccinations, setRecentVaccinations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch user data and stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const user = localStorage.getItem("user");
        if (!user) {
          navigate("/login");
          return;
        }

        setUserData(JSON.parse(user));

        // Simulated API calls - replace with actual API endpoints
        // Fetch vaccine stats
        const statsResponse = await axios.get("http://localhost:8009/api/vaccine-stats");
        setVaccineStats(statsResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get("http://localhost:8009/api/appointments");
        setUpcomingAppointments(appointmentsResponse.data);

        // Fetch recent vaccinations
        const vaccinationsResponse = await axios.get("http://localhost:8009/api/vaccinations");
        setRecentVaccinations(vaccinationsResponse.data);

        // Fetch notifications
        const notificationsResponse = await axios.get("http://localhost:8009/api/notifications");
        setNotifications(notificationsResponse.data);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>Error loading dashboard: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={assets.profile}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">Welcome, {userData?.name}!</h1>
                <p className="text-blue-100">
                  {userData?.roles} | {userData?.email}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => navigate("/appointment/new")}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Book New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {["overview", "appointments", "history", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Vaccines</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {vaccineStats.totalVaccines}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {vaccineStats.completedVaccines}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {vaccineStats.upcomingVaccines}
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Book Appointment",
              icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
              color: "blue",
              onClick: () => navigate("/appointment/new"),
            },
            {
              title: "Update Profile",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              color: "green",
              onClick: () => navigate("/my-profile"),
            },
            {
              title: "View History",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              color: "purple",
              onClick: () => setActiveTab("history"),
            },
            {
              title: "Help Center",
              icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "indigo",
              onClick: () => navigate("/help"),
            },
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 hover:transform hover:scale-105`}
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={action.icon}
                />
              </svg>
              <span className="text-sm font-semibold">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Conditional Content Based on Active Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Appointments
              </h2>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {appointment.vaccineName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.location}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming appointments
                </p>
              )}
            </div>

            {/* Recent Vaccinations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Vaccinations
              </h2>
              {recentVaccinations.length > 0 ? (
                <div className="space-y-4">
                  {recentVaccinations.map((vaccination) => (
                    <div
                      key={vaccination.id}
                      className="border-l-4 border-green-500 pl-4 py-2"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {vaccination.vaccineName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vaccination.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vaccination.center}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No vaccination history
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              All Appointments
            </h2>
            {/* Add your appointments table or list here */}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Vaccination History
            </h2>
            {/* Add your vaccination history here */}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Notifications
            </h2>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        notification.type === "appointment"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-yellow-100 text-yellow-500"
                      }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No new notifications
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;