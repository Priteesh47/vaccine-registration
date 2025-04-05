import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vaccines as defaultVaccines } from '../assets/assets';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState(defaultVaccines);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [vaccineForm, setVaccineForm] = useState({
    name: "",
    manufacturer: "",
    description: "",
    features: "",
    dosage: "",
    speciality: ""
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (activeTab === "appointments") {
      fetchAppointments();
    } else if (activeTab === "vaccines") {
      fetchVaccines();
    } else if (activeTab === "centers") {
      fetchCenters();
    }
  }, [activeTab, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/appointments/staff",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      const response = await axios.get("http://localhost:5000/api/vaccines", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
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
      const response = await axios.get("http://localhost:5000/api/centers");
      setCenters(response.data);
    } catch (error) {
      toast.error("Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
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
      const response = await axios.post("http://localhost:5000/api/vaccines", vaccineForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (response.data) {
        toast.success("Vaccine added successfully");
        setShowVaccineForm(false);
        setVaccineForm({
          name: "",
          manufacturer: "",
          description: "",
          features: "",
          dosage: "",
          speciality: ""
        });
        // Update the vaccines list with the new vaccine
        setVaccines([...vaccines, response.data]);
      }
    } catch (error) {
      console.error("Error adding vaccine:", error);
      toast.error(error.response?.data?.error || "Failed to add vaccine");
    }
  };

  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/centers",
        centerForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
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
      if (error.response?.data?.missingFields) {
        toast.error(
          `Missing required fields: ${error.response.data.missingFields.join(
            ", "
          )}`
        );
      } else {
        toast.error(error.response?.data?.error || "Failed to add center");
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
      setVaccineForm(prev => ({
        ...prev,
        image: file
      }));
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
      features: vaccine.features || "",
      dosage: vaccine.dosage || "",
      speciality: vaccine.speciality || ""
    });
  };

  const filteredAppointments =
    selectedStatus === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === selectedStatus
        );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage appointments, vaccines, and centers
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`${
                activeTab === "appointments"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("vaccines")}
              className={`${
                activeTab === "vaccines"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Vaccines
            </button>
            <button
              onClick={() => setActiveTab("centers")}
              className={`${
                activeTab === "centers"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Centers
            </button>
          </nav>
        </div>

        {activeTab === "appointments" ? (
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

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
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
                            {new Date(
                              appointment.appointment_date
                            ).toLocaleDateString()}
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
            )}
          </>
        ) : activeTab === "vaccines" ? (
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-semibold mb-4">Add New Vaccine</h2>
                  <form onSubmit={handleVaccineSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="vaccineSelect" className="block text-sm font-medium text-gray-700">
                          Select Vaccine
                        </label>
                        <select
                          id="vaccineSelect"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          onChange={(e) => {
                            const selected = vaccines.find(v => v._id === e.target.value);
                            if (selected) handleVaccineSelect(selected);
                          }}
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
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                          Features
                        </label>
                        <textarea
                          id="features"
                          name="features"
                          value={vaccineForm.features}
                          onChange={handleVaccineChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
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
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">
                          Speciality
                        </label>
                        <input
                          type="text"
                          id="speciality"
                          name="speciality"
                          value={vaccineForm.speciality}
                          onChange={handleVaccineChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVaccineForm(false);
                          setSelectedVaccine(null);
                          setVaccineForm({
                            name: "",
                            manufacturer: "",
                            description: "",
                            features: "",
                            dosage: "",
                            speciality: ""
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

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vaccines.map((vaccine) => (
                    <li key={vaccine._id} className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        {vaccine.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={vaccine.image}
                              alt={vaccine.name}
                              className="h-20 w-20 object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {vaccine.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Features: {vaccine.features}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dosage: {vaccine.dosage}
                          </p>
                          <p className="text-sm text-gray-500">
                            Speciality: {vaccine.speciality}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
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
                  <form onSubmit={handleCenterSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={centerForm.address}
                          onChange={handleCenterChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
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
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
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
                          value={centerForm.email}
                          onChange={handleCenterChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCenterForm(false)}
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

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
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
                            {center.address}, {center.city}, {center.state}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {center.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {center.email}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
