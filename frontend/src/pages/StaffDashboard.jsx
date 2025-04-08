import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from "../assets/assets";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("appointments");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVaccines: 0,
    totalFeedbacks: 0,
    pendingAppointments: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    recentAppointments: [],
  });

  // Add missing state variables
  const [users, setUsers] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [centers, setCenters] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [vaccineForm, setVaccineForm] = useState({
    name: "",
    manufacturer: "",
    description: "",
    dosage: "",
    age_group: "",
    effectiveness: "",
  });
  const [centerForm, setCenterForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "Staff") {
      navigate("/login");
      return;
    }

    setUserData(user);
    fetchStats();
    fetchUsers();
    fetchVaccines();
    fetchCenters();
    fetchFeedbacks();
    fetchAppointments();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const fetchVaccines = async () => {
    try {
      const response = await api.get("/vaccines");
      if (response.data) {
        setVaccines(response.data);
      }
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to fetch vaccines");
    }
  };

  const fetchCenters = async () => {
    try {
      console.log("Fetching centers...");
      const response = await api.get("/centers");
      console.log("Centers response:", response.data);
      if (response.data.success) {
        setCenters(response.data.centers);
        console.log("Centers set:", response.data.centers);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast.error("Failed to fetch centers");
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/feedback");
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to fetch feedbacks");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointment");
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const response = await api.put(`/users/${userId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("User status updated successfully");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleVaccineSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/vaccines", {
        name: vaccineForm.name,
        manufacturer: vaccineForm.manufacturer,
        description: vaccineForm.description,
        dosageRequired: parseInt(vaccineForm.dosage),
        ageGroup: vaccineForm.age_group,
        sideEffects: vaccineForm.effectiveness,
        stockAvailable: 100, // Default value
        price: 0, // Default value
        daysUntilNextDose: 0, // Default value
      });

      if (response.data) {
        toast.success("Vaccine added successfully");
        setShowVaccineForm(false);
        setVaccineForm({
          name: "",
          manufacturer: "",
          description: "",
          dosage: "",
          age_group: "",
          effectiveness: "",
        });
        fetchVaccines();
      }
    } catch (error) {
      console.error("Error adding vaccine:", error);
      toast.error(error.response?.data?.message || "Failed to add vaccine");
    }
  };

  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/centers", centerForm);
      if (response.data.success) {
        toast.success("Center added successfully");
        setShowCenterForm(false);
        setCenterForm({
          name: "",
          address: "",
          city: "",
          state: "",
          phone: "",
          email: "",
        });
        fetchCenters();
      }
    } catch (error) {
      console.error("Error adding center:", error);
      toast.error(error.response?.data?.message || "Failed to add center");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/staff/profile", profileForm);
      if (response.data.success) {
        toast.success("Profile updated successfully");
        setProfileForm({
          name: "",
          email: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleVaccineChange = (e) => {
    const { name, value } = e.target;
    setVaccineForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCenterChange = (e) => {
    const { name, value } = e.target;
    setCenterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileClick = () => {
    setShowProfileForm(true);
    setProfileForm({
      name: userData?.name || "",
      email: userData?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setVaccineForm((prev) => ({
        ...prev,
        image: file,
      }));

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVaccineSelect = (vaccine) => {
    setSelectedVaccine(vaccine);
    setVaccineForm({
      name: vaccine.name,
      manufacturer: vaccine.manufacturer || "",
      description: vaccine.description || "",
      dosage: vaccine.dosage || "",
      age_group: vaccine.age_group || "",
      effectiveness: vaccine.effectiveness || "",
    });
  };

  const filteredAppointments =
    selectedStatus === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === selectedStatus
        );

  const handleDeleteCenter = async (centerId) => {
    try {
      const response = await api.delete(`/centers/${centerId}`);
      if (response.data.success) {
        toast.success("Center deleted successfully");
        fetchCenters();
      }
    } catch (error) {
      console.error("Error deleting center:", error);
      toast.error(error.response?.data?.message || "Failed to delete center");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md fixed h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
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
        <nav className="mt-4">
          <div className="px-2 space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => {
                setActiveSection("dashboard");
                setActiveTab("appointments");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "dashboard"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </button>

            {/* User Management */}
            <button
              onClick={() => {
                setActiveSection("users");
                setActiveTab("users");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "users"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "users"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              User Management
            </button>

            {/* Vaccine Management */}
            <button
              onClick={() => {
                setActiveSection("vaccines");
                setActiveTab("vaccines");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "vaccines"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "vaccines"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
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
              Vaccine Management
            </button>

            {/* Centers Management */}
            <button
              onClick={() => {
                setActiveSection("centers");
                setActiveTab("centers");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "centers"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "centers"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
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
              Centers Management
            </button>

            {/* Feedback Management */}
            <button
              onClick={() => {
                setActiveSection("feedback");
                setActiveTab("feedback");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "feedback"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "feedback"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Feedback Management
            </button>

            {/* Profile Button */}
            <button
              onClick={() => {
                setActiveSection("profile");
                handleProfileClick();
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === "profile"
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Settings
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Staff Dashboard</h1>
                <p className="text-blue-100">
                  Manage users, vaccines, and feedback
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-8">
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {userData?.name}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Here's an overview of your vaccination center
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Appointments */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Appointments
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.totalAppointments}
                      </p>
                    </div>
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                  <div className="h-40">
                    <Doughnut
                      data={{
                        labels: ["Completed", "Upcoming", "Cancelled"],
                        datasets: [
                          {
                            data: [
                              Math.max(1, stats.completedAppointments || 0),
                              Math.max(1, stats.upcomingAppointments || 0),
                              Math.max(
                                1,
                                stats.totalAppointments -
                                  (stats.completedAppointments || 0) -
                                  (stats.upcomingAppointments || 0) || 0
                              ),
                            ],
                            backgroundColor: [
                              "#10B981", // Green
                              "#3B82F6", // Blue
                              "#EF4444", // Red
                            ],
                            borderColor: "#ffffff",
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "70%",
                        plugins: {
                          legend: {
                            display: true,
                            position: "bottom",
                            labels: {
                              boxWidth: 12,
                              padding: 15,
                              font: {
                                size: 12,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Completed Vaccinations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed Vaccinations
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.completedAppointments}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="h-40">
                    <Line
                      data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [
                          {
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: "#10B981",
                            tension: 0.4,
                            fill: true,
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Upcoming Appointments
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.upcomingAppointments}
                      </p>
                    </div>
                    <div className="bg-yellow-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-yellow-600"
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
                  <div className="h-40">
                    <Bar
                      data={{
                        labels: ["This Week", "Next Week", "Later"],
                        datasets: [
                          {
                            data: [
                              Math.max(1, stats.upcomingAppointments * 0.4),
                              Math.max(1, stats.upcomingAppointments * 0.3),
                              Math.max(1, stats.upcomingAppointments * 0.3),
                            ],
                            backgroundColor: [
                              "rgba(59, 130, 246, 0.8)", // Blue
                              "rgba(96, 165, 250, 0.8)", // Lighter Blue
                              "rgba(147, 197, 253, 0.8)", // Lightest Blue
                            ],
                            borderRadius: 8,
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {stats.recentAppointments?.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.vaccine?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Management
                </h2>
                <p className="mt-2 text-gray-600">
                  Manage user accounts and permissions
                </p>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Email: {user.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Role: {user.role}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              handleUserStatusChange(
                                user._id,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "vaccines" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Vaccine Management
                </h2>
                <button
                  onClick={() => setShowVaccineForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add New Vaccine
                </button>
              </div>

              {showVaccineForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">
                      Add New Vaccine
                    </h2>
                    <form onSubmit={handleVaccineSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Vaccine Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={vaccineForm.name}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="manufacturer"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          id="manufacturer"
                          name="manufacturer"
                          value={vaccineForm.manufacturer}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={vaccineForm.description}
                          onChange={handleVaccineChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dosage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Dosage
                        </label>
                        <input
                          type="text"
                          id="dosage"
                          name="dosage"
                          value={vaccineForm.dosage}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="age_group"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Age Group
                        </label>
                        <input
                          type="text"
                          id="age_group"
                          name="age_group"
                          value={vaccineForm.age_group}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="effectiveness"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Effectiveness
                        </label>
                        <input
                          type="text"
                          id="effectiveness"
                          name="effectiveness"
                          value={vaccineForm.effectiveness}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowVaccineForm(false);
                            setVaccineForm({
                              name: "",
                              manufacturer: "",
                              description: "",
                              dosage: "",
                              age_group: "",
                              effectiveness: "",
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
                          Add Vaccine
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vaccines.map((vaccine) => (
                    <li key={vaccine._id} className="px-6 py-4">
                      <div className="flex items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {vaccine.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Manufacturer: {vaccine.manufacturer}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dosage: {vaccine.dosage}
                          </p>
                          <p className="text-sm text-gray-500">
                            Age Group: {vaccine.age_group}
                          </p>
                          <p className="text-sm text-gray-500">
                            Effectiveness: {vaccine.effectiveness}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "centers" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Center Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage vaccination centers and their details
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCenterForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Center
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : centers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No centers found. Add a new center to get started.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {centers.map((center) => (
                          <li key={center._id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-indigo-600 truncate">
                                    {center.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {center.address}, {center.city},{" "}
                                    {center.state}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Phone: {center.phone} | Email:{" "}
                                    {center.email}
                                  </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <button
                                    onClick={() =>
                                      handleDeleteCenter(center._id)
                                    }
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "feedback" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Feedback Management
                </h2>
                <p className="mt-2 text-gray-600">
                  View and manage user feedback
                </p>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {feedbacks.map((feedback) => (
                    <li key={feedback._id} className="px-6 py-4">
                      <div className="flex items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {feedback.user?.name || "Anonymous User"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Rating: {feedback.rating}/5
                          </p>
                          <p className="text-sm text-gray-500">
                            {feedback.comment}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date:{" "}
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Settings
                </h2>
                <p className="mt-2 text-gray-600">
                  Manage your account information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-gray-900">{userData?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-gray-900">{userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="mt-1 text-gray-900">{userData?.role}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Update Profile
                  </h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={profileForm.newPassword}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={profileForm.confirmPassword}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
