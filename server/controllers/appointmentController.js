const db = require('../config/db');

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

// Get all appointments for a user
const getUserAppointments = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [appointments] = await connection.query(`
      SELECT a.*, 
             v.name as vaccine_name, 
             v.manufacturer as vaccine_manufacturer
      FROM appointments a
      JOIN vaccines v ON a.vaccine_id = v.id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC
    `, [req.user.id]);

    return res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  } finally {
    if (connection) connection.release();
  }
};

// Get all appointments (admin only)
const getAllAppointments = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [appointments] = await connection.query(`
      SELECT a.*, 
             c.name as center_name, c.address as center_address,
             v.name as vaccine_name, v.manufacturer as vaccine_manufacturer,
             u.name as user_name, u.email as user_email
      FROM appointments a
      JOIN centers c ON a.center_id = c.id
      JOIN vaccines v ON a.vaccine_id = v.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);

    return res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  } finally {
    if (connection) connection.release();
  }
};

// Get available time slots for a center
const getAvailableSlots = async (req, res) => {
  const { centerId, date } = req.query;
  let connection;
  
  try {
    connection = await db.getConnection();
    
    // Get center operating hours
    const [center] = await connection.query(
      'SELECT opening_time, closing_time FROM centers WHERE id = ?',
      [centerId]
    );
    
    if (!center.length) {
      return res.status(404).json({
        success: false,
        message: 'Center not found'
      });
    }

    const { opening_time, closing_time } = center[0];
    
    // Generate 30-minute slots between opening and closing time
    const slots = [];
    let currentTime = new Date(`1970-01-01T${opening_time}`);
    const endTime = new Date(`1970-01-01T${closing_time}`);
    
    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    // Get booked slots for the given date
    const [bookedSlots] = await connection.query(
      'SELECT appointment_time FROM appointments WHERE center_id = ? AND appointment_date = ?',
      [centerId, date]
    );
    
    const bookedTimes = bookedSlots.map(slot => slot.appointment_time);
    const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));
    
    return res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching available slots'
    });
  } finally {
    if (connection) connection.release();
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let connection;
  
  try {
    connection = await db.getConnection();
    
    const [result] = await connection.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating appointment status'
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
    createAppointment,
    getUserAppointments,
    getAllAppointments,
    getAvailableSlots,
    updateAppointmentStatus
}; 