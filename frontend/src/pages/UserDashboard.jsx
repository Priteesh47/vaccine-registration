import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from '../assets/assets';

const UserDashboard = () => {
  const navigate = useNavigate();
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
  const [appointmentForm, setAppointmentForm] = useState({
    vaccineId: "",
    centerId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [vaccines, setVaccines] = useState(defaultVaccines);
  const [centers, setCenters] = useState([]);

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
  }, [navigate]);

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
      const response = await api.get("/centers");
      setCenters(response.data);
    } catch (error) {
      toast.error("Failed to fetch centers");
    }
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/appointments/create", {
        vaccine_id: appointmentForm.vaccineId,
        center_id: appointmentForm.centerId,
        appointment_date: `${appointmentForm.appointmentDate} ${appointmentForm.appointmentTime}`,
        notes: appointmentForm.notes,
      });

      if (response.data) {
        toast.success("Appointment created successfully");
        setShowAppointmentForm(false);
        setAppointmentForm({
          vaccineId: "",
          centerId: "",
          appointmentDate: "",
          appointmentTime: "",
          notes: "",
        });
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
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

  const filteredAppointments =
    selectedStatus === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === selectedStatus
        );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {userData?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome, {userData?.name}!
                </h1>
                <p className="text-blue-100">
                  {userData?.role} | {userData?.email}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Book New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Appointments</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {stats.totalAppointments}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completed Appointments</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {stats.completedAppointments}
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

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Upcoming Appointments</p>
                <h3 className="text-2xl font-bold text-purple-600">
                  {stats.upcomingAppointments}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-500"
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

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  My Appointments
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your vaccination appointments
                </p>
              </div>
              <div className="w-full md:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Appointments</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No appointments
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by booking a new appointment.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    New Appointment
                  </button>
                </div>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.vaccine_name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Center</p>
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.center_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(
                              appointment.appointment_date
                            ).toLocaleDateString()}{" "}
                            at {appointment.appointment_time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {appointment.status === "pending" && (
                        <button
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vaccines Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Vaccines</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccines.map((vaccine) => (
              <div key={vaccine._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {vaccine.image && (
                  <div className="h-48 w-full">
                    <img
                      src={vaccine.image}
                      alt={vaccine.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {vaccine.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Features:</span> {vaccine.features}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Dosage:</span> {vaccine.dosage}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Speciality:</span> {vaccine.speciality}
                  </p>
                  <button
                    onClick={() => {
                      setAppointmentForm(prev => ({
                        ...prev,
                        vaccineId: vaccine._id
                      }));
                      setShowAppointmentForm(true);
                    }}
                    className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="vaccineId"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      <option key={vaccine._id} value={vaccine._id}>
                        {vaccine.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="centerId"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                      <option key={center.id} value={center.id}>
                        {center.name} - {center.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={appointmentForm.appointmentDate}
                    onChange={handleAppointmentChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="appointmentTime"
                    className="block text-sm font-medium text-gray-700"
                  >
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

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={appointmentForm.notes}
                    onChange={handleAppointmentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book Appointment
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
