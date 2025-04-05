import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAppointment } from '../services/appointmentService';
import axios from 'axios';

const Appointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vaccine_id: '',
        appointment_date: ''
    });
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchVaccines();
    }, []);

    const fetchVaccines = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vaccines', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setVaccines(response.data);
        } catch (error) {
            setError('Error fetching vaccines');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDateTimeForNepal = (dateTimeString) => {
        // Create a date object from the input
        const date = new Date(dateTimeString);
        
        // Convert to Nepal time (UTC+5:45)
        const nepalOffset = 5 * 60 + 45; // 5 hours and 45 minutes in minutes
        const userOffset = date.getTimezoneOffset(); // Get user's timezone offset in minutes
        const totalOffsetMinutes = nepalOffset + userOffset;
        
        // Add the offset to get Nepal time
        date.setMinutes(date.getMinutes() + totalOffsetMinutes);
        
        // Format date to MySQL format: YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.vaccine_id || !formData.appointment_date) {
                setError('Please fill all required fields');
                return;
            }

            // Format the date for Nepal timezone
            const formattedDate = formatDateTimeForNepal(formData.appointment_date);
            console.log('Formatted date for Nepal:', formattedDate); // Debug log

            await createAppointment({
                ...formData,
                appointment_date: formattedDate
            });

            alert('Appointment created successfully');
            navigate('/my-appointments');
        } catch (error) {
            console.error('Appointment error:', error); // Debug log
            setError(error.response?.data?.message || 'Error creating appointment');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in Nepal timezone
    const getTodayInNepal = () => {
        const now = new Date();
        const nepalOffset = 5 * 60 + 45; // 5 hours and 45 minutes in minutes
        const userOffset = now.getTimezoneOffset();
        const totalOffsetMinutes = nepalOffset + userOffset;
        
        now.setMinutes(now.getMinutes() + totalOffsetMinutes);
        return now.toISOString().split('T')[0];
    };

    const today = getTodayInNepal();

    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Book Appointment</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Vaccine *
                        </label>
                        <select
                            name="vaccine_id"
                            value={formData.vaccine_id}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose a vaccine</option>
                            {vaccines.map((vaccine) => (
                                <option key={vaccine.id} value={vaccine.id}>
                                    {vaccine.name} - {vaccine.manufacturer}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Appointment Date & Time * (Nepal Time)
                        </label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            min={today}
                            required
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <small className="text-gray-500">
                            Please select time between 10:00 AM and 5:00 PM Nepal time
                        </small>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating Appointment...' : 'Book Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Appointment;
