import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from '../assets/assets';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVaccines: 0,
    totalFeedbacks: 0,
    pendingAppointments: 0
  });

  // Previous state
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState(defaultVaccines);
  const [centers, setCenters] = useState([]);
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
    effectiveness: ""
  });
  const [centerForm, setCenterForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: ""
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "Staff") {
      navigate("/login");
      return;
    }

    setUserData(user);
    fetchDashboardStats();

    if (activeTab === "appointments") {
      fetchAppointments();
    } else if (activeTab === "vaccines") {
      fetchVaccines();
    } else if (activeTab === "centers") {
      fetchCenters();
    }
  }, [activeTab, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/staff/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments/staff", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vaccines", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
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
      if (response.data) {
        setCenters(response.data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to view centers. Please check your role or login again.");
        if (!userData?.role || userData.role !== 'Staff') {
          navigate("/login");
        }
      } else {
        toast.error("Failed to fetch centers");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Appointment status updated");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const handleVaccineSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields first
      if (!vaccineForm.name || !vaccineForm.manufacturer) {
        toast.error("Name and manufacturer are required");
        return;
      }

      const response = await api.post("/vaccines", vaccineForm, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
          effectiveness: ""
        });
        fetchVaccines();
      }
    } catch (error) {
      console.error("Error adding vaccine:", error.response?.data || error);
      const errorMessage = error.response?.data?.error || "Failed to add vaccine";
      toast.error(errorMessage);
    }
  };

  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'state', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !centerForm[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const response = await api.post("/centers", {
        name: centerForm.name,
        address: centerForm.address,
        city: centerForm.city,
        state: centerForm.state,
        phone: centerForm.phone,
        email: centerForm.email
      });

      if (response.data) {
        toast.success("Center added successfully");
        setShowCenterForm(false);
        setCenterForm({
          name: "",
          address: "",
          city: "",
          state: "",
          phone: "",
          email: ""
        });
        fetchCenters();
      }
    } catch (error) {
      console.error("Error adding center:", error);
      if (error.response?.status === 403) {
        toast.error("You don't have permission to add centers. Please check your role or login again.");
        if (!userData?.role || userData.role !== 'Staff') {
          navigate("/login");
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add center");
      }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setVaccineForm(prev => ({
        ...prev,
        image: file
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

  const filteredAppointments = selectedStatus === "all"
    ? appointments
    : appointments.filter((appointment) => appointment.status === selectedStatus);

  const handleProfileClick = () => {
    setShowProfileForm(true);
    setProfileForm({
      name: userData?.name || "",
      email: userData?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        name: profileForm.name,
        email: profileForm.email
      };

      if (profileForm.newPassword && profileForm.currentPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      const response = await api.put("/staff/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setUserData(prev => ({
          ...prev,
          name: profileForm.name,
          email: profileForm.email
        }));
        localStorage.setItem("user", JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          name: profileForm.name,
          email: profileForm.email
        }));
        setShowProfileForm(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
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
                setActiveSection('dashboard');
                setActiveTab("appointments");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'dashboard' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
                setActiveSection('users');
                setActiveTab("users");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'users' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'users' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
                setActiveSection('vaccines');
                setActiveTab("vaccines");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'vaccines' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'vaccines' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
                setActiveSection('centers');
                setActiveTab("centers");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'centers' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'centers' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
                setActiveSection('feedback');
                setActiveTab("feedback");
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'feedback' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'feedback' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
                setActiveSection('profile');
                handleProfileClick();
              }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                activeSection === 'profile' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  activeSection === 'profile' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {stats.totalUsers}
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Vaccines */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Vaccines</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    {stats.totalVaccines}
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Feedbacks */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Feedbacks</p>
                  <h3 className="text-2xl font-bold text-purple-600">
                    {stats.totalFeedbacks}
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
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Pending Appointments</p>
                  <h3 className="text-2xl font-bold text-yellow-600">
                    {stats.pendingAppointments}
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

          {/* Content based on active section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === "appointments" && (
              <>
                <div className="mb-6">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <li key={appointment.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patient_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Vaccine: {appointment.vaccine_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Date:{" "}
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Time: {appointment.appointment_time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <select
                              value={appointment.status}
                              onChange={(e) =>
                                handleStatusChange(appointment.id, e.target.value)
                              }
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === "vaccines" && (
              <>
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
                      <h2 className="text-xl font-semibold mb-4">Add New Vaccine</h2>
                      <form onSubmit={handleVaccineSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
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
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
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
                          <label htmlFor="age_group" className="block text-sm font-medium text-gray-700">
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
                          <label htmlFor="effectiveness" className="block text-sm font-medium text-gray-700">
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
                                effectiveness: ""
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
              </>
            )}

            {activeTab === "centers" && (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Vaccine Centers Management
                  </h2>
                  <button
                    onClick={() => setShowCenterForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Center
                  </button>
                </div>

                {showCenterForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h2 className="text-xl font-semibold mb-4">Add New Center</h2>
                      <form onSubmit={handleCenterSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Center Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={centerForm.name}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={centerForm.address}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={centerForm.city}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={centerForm.state}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={centerForm.phone}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={centerForm.email}
                            onChange={handleCenterChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCenterForm(false);
                              setCenterForm({
                                name: "",
                                address: "",
                                city: "",
                                state: "",
                                phone: "",
                                email: ""
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
                            Add Center
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {centers.map((center) => (
                      <li key={center.id} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {center.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              <span className="font-medium">Address:</span> {center.address}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Location:</span> {center.city}, {center.state}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Contact:</span> {center.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Email:</span> {center.email}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Profile Form Modal */}
            {showProfileForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password (required for password change)
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
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password (optional)
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
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowProfileForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
