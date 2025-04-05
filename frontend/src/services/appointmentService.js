import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

// Create new appointment
export const createAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(API_URL, appointmentData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user's appointments
export const getUserAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/my-appointments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all appointments (for staff)
export const getAllAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${appointmentId}/status`, 
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 