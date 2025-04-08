const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const {
  getUserAppointments,
  getAllAppointments,
  getAvailableSlots,
  updateAppointmentStatus,
  createAppointment
} = require('../controllers/appointmentController');

// Create a new appointment (requires authentication)
router.post('/', authenticateToken, createAppointment);

// Get user's appointments (requires authentication)
router.get('/my-appointments', authenticateToken, getUserAppointments);

// Get all appointments (requires authentication)
router.get('/all', authenticateToken, getAllAppointments);

// Update appointment status (requires authentication)
router.patch('/:id/status', authenticateToken, updateAppointmentStatus);

// Get all appointments for a user
router.get('/user', authenticateToken, getUserAppointments);

// Get available time slots for a center
router.get('/slots', getAvailableSlots);

// Book a new appointment
router.post('/', authenticateToken, async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const {
      centerId,
      vaccineId,
      appointmentDate,
      appointmentTime,
      notes
    } = req.body;

    // Check if the slot is available
    const [existingAppointments] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM appointments 
      WHERE center_id = ? 
      AND appointment_date = ? 
      AND appointment_time = ?
    `, [centerId, appointmentDate, appointmentTime]);

    if (existingAppointments[0].count > 0) {
      throw new Error('This time slot is already booked');
    }

    // Create the appointment
    const [result] = await connection.query(`
      INSERT INTO appointments (
        user_id, center_id, vaccine_id, 
        appointment_date, appointment_time, 
        status, notes
      ) VALUES (?, ?, ?, ?, ?, 'Scheduled', ?)
    `, [
      req.user.id,
      centerId,
      vaccineId,
      appointmentDate,
      appointmentTime,
      notes
    ]);

    await connection.commit();

    return res.json({
      success: true,
      message: 'Appointment booked successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error booking appointment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error booking appointment'
    });
  } finally {
    if (connection) connection.release();
  }
});

// Cancel an appointment
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(`
      UPDATE appointments 
      SET status = 'Cancelled' 
      WHERE id = ? AND user_id = ?
    `, [req.params.id, req.user.id]);

    if (result.affectedRows === 0) {
      throw new Error('Appointment not found or you do not have permission to cancel it');
    }

    await connection.commit();

    return res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error cancelling appointment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling appointment'
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router; 