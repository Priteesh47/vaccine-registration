import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from "../assets/assets";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { assets } from "../assets/assets";
import axios from "axios";
import {
  FaUser,
  FaCalendarAlt,
  FaCog,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // User data and stats
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

  // Forms & related state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    vaccineId: "",
    centerId: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: null,
    profilePictureUrl: null,
  });

  // Vaccines and centers lists
  const [vaccines, setVaccines] = useState(defaultVaccines);
  const [centers, setCenters] = useState([
    {
      name: "City Health Center",
      description:
        "Main vaccination center in the city, offering comprehensive immunization services",
      address: "123 Main Street, Downtown, City, State 10001",
      email: "cityhealth@example.com",
      vaccines: ["COVID-19", "Flu", "Hepatitis B", "MMR", "Tetanus"],
    },
    {
      name: "Community Medical Center",
      description:
        "Serving the local community with state-of-the-art facilities",
      address: "456 Oak Avenue, Suburb District, City, State 10002",
      email: "communitymed@example.com",
      vaccines: ["COVID-19", "MMR", "Tetanus", "Hepatitis A", "Polio"],
    },
    {
      name: "Mediciti Hospital",
      description:
        "Full-service medical facility with dedicated vaccination wing",
      address: "Nakhu, Kathmandu",
      email: "medictinep@gmail.com",
      vaccines: ["COVID-19", "Flu", "Hepatitis A", "Hepatitis B", "Varicella"],
    },
    {
      name: "Westside Health Clinic",
      description: "Modern clinic serving the western region",
      address: "321 Elm Street, Westside, City, State 10004",
      email: "westside@example.com",
      vaccines: ["COVID-19", "Flu", "HPV", "Meningococcal", "Pneumococcal"],
    },
    {
      name: "Norvic Hospital",
      description: "Comprehensive healthcare facility in the eastern district",
      address: "Thapathali, Kathmandu",
      email: "NorvicNepal@gmail.com",
      vaccines: ["COVID-19", "Flu", "Hepatitis B", "MMR", "Tetanus"],
    },
    {
      name: "Civil Service Hospital",
      description:
        "Community-focused hospital with dedicated vaccination services",
      address: "New Baneshwor, Kathmandu",
      email: "CivilServiceNep@gmail.com",
      vaccines: ["COVID-19", "Flu", "Hepatitis A", "Polio", "Varicella"],
    },
    {
      name: "B & B Hospital",
      description: "Modern facility serving the southern communities",
      address: "Gwarko, Lalitpur",
      email: "bnbNep@gmail.com",
      vaccines: ["COVID-19", "Flu", "HPV", "Meningococcal", "Pneumococcal"],
    },
  ]);

  // Additional state for UI control
  const [activeSection, setActiveSection] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication and initialize headers
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || user.role !== "User") {
          navigate("/login");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Authentication check error:", error);
        navigate("/login");
        return false;
      }
    };

    const isAuthenticated = checkAuth();
    if (!isAuthenticated) return;

    // Set up API headers with the retrieved token
    const token = localStorage.getItem("token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Set user data
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    setAuthChecked(true);
  }, [navigate]);

  // Fetch dashboard data after auth is confirmed
  useEffect(() => {
    if (!userData || !authChecked) return;

    let isMounted = true;
    const fetchData = async () => {
      if (loading) return; // Prevent multiple simultaneous fetches
      setLoading(true);
      try {
        const [
          dashboardData,
          appointmentsData,
          vaccinesData,
          centersData,
          profileData,
        ] = await Promise.all([
          api.get("/user/stats"),
          api.get("/appointments/my-appointments"),
          api.get("/vaccines"),
          api.get("/centers"),
          api.get("/profile"),
        ]);

        if (!isMounted) return;

        if (dashboardData.data.success) {
          setStats(dashboardData.data.data);
        }
        if (appointmentsData.data.success) {
          setAppointments(appointmentsData.data.data);
        }
        if (vaccinesData.data.success) {
          setVaccines(vaccinesData.data.data);
        }
        if (centersData.data.success) {
          setCenters(centersData.data.data);
        }
        // Update profile state using the correct setter
        if (profileData.data.success) {
          setProfileForm(profileData.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (isMounted) {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userData, authChecked]);

  // Handle appointment modal opening via location state
  useEffect(() => {
    if (location.state?.openAppointmentModal) {
      setShowAppointmentForm(true);
      if (location.state.selectedCenter) {
        setAppointmentForm((prev) => ({
          ...prev,
          center_id: location.state.selectedCenter.id,
          center_name: location.state.selectedCenter.name,
        }));
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Handle API errors
  const handleApiError = (error, apiName) => {
    console.error(`Error fetching ${apiName}:`, error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }
    toast.error(`Failed to load ${apiName}`);
  };

  // Example: Handle appointment cancellation (function truncated for brevity)
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await api.delete(`/appointments/${appointmentId}`);
      if (response.data.success) {
        toast.success("Appointment cancelled successfully");
        // Update appointments state accordingly
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      handleApiError(error, "cancel appointment");
    }
  };

  // Render loading state or error if necessary
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Render your dashboard UI here
  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {userData?.name}</h1>
        {/* Additional header UI elements */}
      </header>

      <section className="stats-section">
        <div>Total Appointments: {stats.totalAppointments}</div>
        <div>Completed Appointments: {stats.completedAppointments}</div>
        <div>Upcoming Appointments: {stats.upcomingAppointments}</div>
      </section>

      <section className="appointments-section">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <p>{appointment.details}</p>
              <button onClick={() => handleCancelAppointment(appointment.id)}>
                Cancel Appointment
              </button>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </section>

      {/* Add additional sections/components for charts, forms, etc. */}
    </div>
  );
};

export default UserDashboard;
