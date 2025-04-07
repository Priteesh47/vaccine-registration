const db = require('../config/database');

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const { vaccine_id, appointment_date } = req.body;
        const user_id = req.user.id; // From auth middleware

        // Validate required fields
        const errors = {};
        if (!vaccine_id) errors.vaccine_id = 'Vaccine ID is required';
        if (!appointment_date) errors.appointment_date = 'Appointment date is required';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed', 
                errors 
            });
        }

        // Format the date for MySQL
        const formattedDate = new Date(appointment_date).toISOString().slice(0, 19).replace('T', ' ');

        // Validate appointment date is in the future
        const appointmentDate = new Date(appointment_date);
        if (appointmentDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date must be in the future'
            });
        }

        // Check if vaccine exists
        const [vaccines] = await db.query(
            'SELECT * FROM vaccines WHERE id = ?',
            [vaccine_id]
        );

        if (vaccines.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vaccine not found'
            });
        }

        // Check for conflicting appointments
        const [conflicts] = await db.query(
            'SELECT * FROM appointments WHERE user_id = ? AND appointment_date = ? AND status != "cancelled"',
            [user_id, formattedDate]
        );

        if (conflicts.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'You already have an appointment at this time'
            });
        }

        // Insert appointment
        const [result] = await db.query(
            'INSERT INTO appointments (user_id, vaccine_id, appointment_date, status) VALUES (?, ?, ?, ?)',
            [user_id, vaccine_id, formattedDate, 'scheduled']
        );

        // Get the created appointment with details
        const [appointment] = await db.query(`
            SELECT 
                a.*,
                v.name as vaccine_name,
                v.manufacturer as vaccine_manufacturer,
                u.name as user_name,
                u.email as user_email
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ?
        `, [result.insertId]);

        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: appointment[0]
        });

    } catch (error) {
        console.error('Appointment creation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
};

// Get user's appointments
const getUserAppointments = async (req, res) => {
    try {
        const user_id = req.user.id;

        const [appointments] = await db.query(`
            SELECT 
                a.*,
                v.name as vaccine_name,
                v.manufacturer as vaccine_manufacturer,
                u.name as user_name,
                u.email as user_email
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN users u ON a.user_id = u.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC
        `, [user_id]);

        return res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Get all appointments (for staff)
const getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT 
                a.*,
                v.name as vaccine_name,
                v.manufacturer as vaccine_manufacturer,
                u.name as user_name,
                u.email as user_email
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN users u ON a.user_id = u.id
            ORDER BY a.appointment_date DESC
        `);

        return res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user_id = req.user.id;

        if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be scheduled, completed, or cancelled'
            });
        }

        const [result] = await db.query(
            'UPDATE appointments SET status = ? WHERE id = ? AND user_id = ?',
            [status, id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found or unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully'
        });

    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating appointment status',
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAllAppointments,
    updateAppointmentStatus
}; 