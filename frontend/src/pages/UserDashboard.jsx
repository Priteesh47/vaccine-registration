import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from '../assets/assets';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    recentAppointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    vaccineId: "",
    centerId: "",
    appointmentDate: "",
    appointmentTime: ""
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [vaccines, setVaccines] = useState(defaultVaccines);
  const [centers, setCenters] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "User") {
      navigate("/login");
      return;
    }

    setUserData(user);
    fetchDashboardData();
    fetchAppointments();
    fetchVaccines();
    fetchCenters();
    fetchUserProfile();

    // Handle appointment modal state from navigation
    if (location.state?.openAppointmentModal) {
      setShowAppointmentForm(true);
      if (location.state.selectedCenter) {
        setAppointmentForm(prev => ({
          ...prev,
          centerId: location.state.selectedCenter._id
        }));
      }
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [navigate, location]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/stats");

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error(response.data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching dashboard data"
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments/user");
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vaccines");
      // Combine default vaccines with API vaccines, removing duplicates
      const apiVaccines = response.data;
      const combinedVaccines = [...defaultVaccines];
      
      apiVaccines.forEach(apiVaccine => {
        if (!combinedVaccines.some(v => v.name === apiVaccine.name)) {
          combinedVaccines.push(apiVaccine);
        }
      });
      
      setVaccines(combinedVaccines);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to fetch vaccines");
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await api.get("/centers");
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error("Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setProfileForm({
        name: response.data.name,
        email: response.data.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await api.put(`/api/appointments/${appointmentId}/cancel`);
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      } catch (error) {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!appointmentForm.vaccineId || !appointmentForm.centerId || !appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Combine date and time
      const appointmentDateTime = new Date(appointmentForm.appointmentDate + 'T' + appointmentForm.appointmentTime);

      const response = await api.post("/appointments", {
        vaccine_id: appointmentForm.vaccineId,
        center_id: appointmentForm.centerId,
        appointment_date: appointmentDateTime.toISOString()
      });

      if (response.data) {
        toast.success("Appointment scheduled successfully");
        setShowAppointmentForm(false);
        setAppointmentForm({
          vaccineId: "",
          centerId: "",
          appointmentDate: "",
          appointmentTime: ""
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error(error.response?.data?.error || "Failed to schedule appointment");
    }
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAppointments =
    selectedStatus === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === selectedStatus
        );

  // Add function to handle opening appointment form from vaccine card
  const handleBookVaccine = (vaccine) => {
    setAppointmentForm(prev => ({
      ...prev,
      vaccineId: vaccine._id || vaccine.id
    }));
    setShowAppointmentForm(true);
  };

  // Add function to handle opening appointment form from center card
  const handleBookCenter = (center) => {
    setAppointmentForm(prev => ({
      ...prev,
      centerId: center._id
    }));
    setShowAppointmentForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md min-h-screen">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {userData?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {userData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {/* Overview */}
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>

            {/* Vaccines */}
            <button
              onClick={() => setActiveSection('vaccines')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'vaccines'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Vaccines
            </button>

            {/* Appointments */}
            <button
              onClick={() => setActiveSection('appointments')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'appointments'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Appointments
            </button>

            {/* Centers */}
            <button
              onClick={() => setActiveSection('centers')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'centers'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Centers
            </button>

            {/* Profile */}
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </div>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="mt-2 text-gray-600">Here's an overview of your vaccination journey</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.upcomingAppointments}</p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Completed Vaccinations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Vaccinations</p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.completedAppointments}</p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {stats.recentAppointments.slice(0, 3).map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.vaccine.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'vaccines' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Available Vaccines</h1>
                <p className="mt-2 text-gray-600">Browse and book your vaccination appointments</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaccines.map((vaccine) => (
                  <div
                    key={vaccine._id || vaccine.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={vaccine.image || 'https://via.placeholder.com/400x300'}
                        alt={vaccine.name}
                        className="w-full h-full object-cover"
                      />
                      {vaccine.available && (
                        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{vaccine.name}</h3>
                      <p className="text-gray-600 mb-4">{vaccine.description}</p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Manufacturer: {vaccine.manufacturer}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Dosage: {vaccine.dosage}</span>
                        </div>
                        {vaccine.speciality && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Speciality: {vaccine.speciality}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {vaccine.features && (
                          <div className="text-sm text-gray-600">
                            <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {vaccine.features.split('\n').map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          onClick={() => handleBookVaccine(vaccine)}
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
          )}

          {activeSection === 'appointments' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                <p className="mt-2 text-gray-600">View and manage your vaccination appointments</p>
              </div>

              {/* Filter Buttons */}
              <div className="mb-6 flex space-x-4">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus('upcoming')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'upcoming'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setSelectedStatus('completed')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === 'completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.vaccine.name}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-gray-600">
                          Time: {new Date(appointment.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-gray-600">
                          Center: {appointment.center.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.status === 'upcoming' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment._id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'centers' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Vaccination Centers</h1>
                <p className="mt-2 text-gray-600">Find a vaccination center near you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {centers.map((center) => (
                  <div
                    key={center._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={center.image || 'https://via.placeholder.com/400x300'}
                        alt={center.name}
                        className="w-full h-full object-cover"
                      />
                      {center.isOpen && (
                        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Open
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{center.name}</h3>
                      <p className="text-gray-600 mb-4">{center.address}</p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{center.phone}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookCenter(center)}
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
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="mt-2 text-gray-600">Update your personal information</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Schedule New Appointment</h2>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label htmlFor="vaccineId" className="block text-sm font-medium text-gray-700">
                  Select Vaccine
                </label>
                <select
                  id="vaccineId"
                  name="vaccineId"
                  value={appointmentForm.vaccineId}
                  onChange={handleAppointmentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a vaccine</option>
                  {vaccines.map((vaccine) => (
                    <option key={vaccine.id || vaccine._id} value={vaccine.id || vaccine._id}>
                      {vaccine.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="centerId" className="block text-sm font-medium text-gray-700">
                  Select Center
                </label>
                <select
                  id="centerId"
                  name="centerId"
                  value={appointmentForm.centerId}
                  onChange={handleAppointmentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a center</option>
                  {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                  Appointment Date
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={appointmentForm.appointmentDate}
                  onChange={handleAppointmentChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                  Appointment Time
                </label>
                <input
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={appointmentForm.appointmentTime}
                  onChange={handleAppointmentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setAppointmentForm({
                      vaccineId: "",
                      centerId: "",
                      appointmentDate: "",
                      appointmentTime: ""
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
