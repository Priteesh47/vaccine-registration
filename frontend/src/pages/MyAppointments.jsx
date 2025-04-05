import React, { useState, useEffect } from 'react';
import { getUserAppointments, updateAppointmentStatus } from '../services/appointmentService';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await getUserAppointments();
            setAppointments(response.appointments);
        } catch (error) {
            setError(error.message || 'Error fetching appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await updateAppointmentStatus(id, 'cancelled');
            alert('Appointment cancelled successfully');
            fetchAppointments();
        } catch (error) {
            setError(error.message || 'Error cancelling appointment');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {appointments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No appointments found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vaccine
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.vaccine_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.vaccine_manufacturer}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(appointment.appointment_date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                                                {appointment.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {appointment.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
