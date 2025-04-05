import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const CreateAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vaccineId: '',
        centerId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });
    const [vaccines, setVaccines] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch vaccines and centers
        const fetchData = async () => {
            try {
                const [vaccinesRes, centersRes] = await Promise.all([
                    axios.get('/api/vaccines'),
                    axios.get('/api/centers')
                ]);
                setVaccines(vaccinesRes.data);
                setCenters(centersRes.data);
            } catch (error) {
                toast.error('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/appointments', formData);
            toast.success('Appointment created successfully!');
            navigate('/my-appointments');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Appointment</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Schedule your vaccination appointment
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="vaccineId" className="block text-sm font-medium text-gray-700">
                                Select Vaccine
                            </label>
                            <select
                                id="vaccineId"
                                name="vaccineId"
                                value={formData.vaccineId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select a vaccine</option>
                                {vaccines.map(vaccine => (
                                    <option key={vaccine.id} value={vaccine.id}>
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
                                value={formData.centerId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Select a center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name} - {center.location}
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
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                Additional Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                placeholder="Any special requirements or notes..."
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointment; 