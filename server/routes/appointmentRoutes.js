const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// Create a new appointment (requires authentication)
router.post('/', authenticateToken, appointmentController.createAppointment);

// Get user's appointments (requires authentication)
router.get('/my-appointments', authenticateToken, appointmentController.getUserAppointments);

// Get all appointments (requires authentication)
router.get('/all', authenticateToken, appointmentController.getAllAppointments);

// Update appointment status (requires authentication)
router.patch('/:id/status', authenticateToken, appointmentController.updateAppointmentStatus);

module.exports = router; 