const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Create a new appointment
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { vaccine_id, appointment_date, patient_id } = req.body;
        const user_id = req.user.id; // Get user ID from the authenticated token

        console.log('Creating appointment with data:', {
            user_id,
            vaccine_id,
            appointment_date,
            patient_id
        });

        // Validate required fields
        if (!vaccine_id || !appointment_date || !patient_id) {
            return res.status(400).json({
                message: 'All fields are required',
                details: {
                    vaccine_id: !vaccine_id ? 'Vaccine ID is required' : undefined,
                    appointment_date: !appointment_date ? 'Appointment date is required' : undefined,
                    patient_id: !patient_id ? 'Patient ID is required' : undefined
                }
            });
        }

        // Check if vaccine exists
        const [vaccines] = await db.query('SELECT * FROM vaccines WHERE id = ?', [vaccine_id]);
        if (vaccines.length === 0) {
            return res.status(404).json({ message: 'Vaccine not found' });
        }

        // Check if patient exists and belongs to the user
        const [patients] = await db.query('SELECT * FROM patients WHERE id = ? AND user_id = ?', [patient_id, user_id]);
        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient not found or does not belong to you' });
        }

        // Insert new appointment
        const [result] = await db.query(
            'INSERT INTO appointments (user_id, vaccine_id, patient_id, appointment_date, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, vaccine_id, patient_id, appointment_date, 'scheduled']
        );

        // Get the created appointment with details
        const [appointments] = await db.query(`
            SELECT a.*, v.name as vaccine_name, p.first_name, p.last_name
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN patients p ON a.patient_id = p.id
            WHERE a.id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: appointments[0]
        });
    } catch (error) {
        console.error('Appointment creation error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({
            message: 'Error creating appointment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user's appointments
router.get('/my-appointments', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        const [appointments] = await db.query(`
            SELECT a.*, v.name as vaccine_name, p.first_name, p.last_name
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN patients p ON a.patient_id = p.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC
        `, [user_id]);

        res.json({
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            message: 'Error fetching appointments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all appointments for staff
router.get('/staff', authenticateToken, authorizeRole(['Staff']), async (req, res) => {
    try {
        console.log('Fetching staff appointments...');
        const [appointments] = await db.query(`
            SELECT a.*, v.name as vaccine_name, p.first_name, p.last_name, u.name as user_name
            FROM appointments a
            JOIN vaccines v ON a.vaccine_id = v.id
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON a.user_id = u.id
            ORDER BY a.appointment_date DESC
        `);
        console.log('Appointments fetched successfully:', appointments.length);
        res.json({
            appointments
        });
    } catch (error) {
        console.error('Error fetching staff appointments:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({
            message: 'Error fetching appointments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 