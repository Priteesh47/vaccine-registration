const express = require('express');
const router = express.Router();
const db = require('../db');

// Get dashboard data
router.get('/', async (req, res) => {
    try {
        // Example: Get total number of users and appointments
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');
        
        res.json({
            totalUsers: userCount[0].count,
            totalAppointments: appointmentCount[0].count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 