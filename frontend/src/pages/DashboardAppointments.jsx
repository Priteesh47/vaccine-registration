import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DashboardAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return activeTab === 'upcoming' 
        ? appointmentDate >= today 
        : appointmentDate < today;
    });
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (status.toLowerCase()) {
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your vaccination appointments</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming Appointments
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Past Appointments
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading appointments...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredAppointments().map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
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
                      <span className={getStatusBadgeClass(appointment.status)}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
                {getFilteredAppointments().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No {activeTab} appointments found.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAppointments; 