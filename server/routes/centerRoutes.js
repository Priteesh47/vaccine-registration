const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all centers
router.get('/', authenticateToken, authorizeRole(['admin', 'staff']), async (req, res) => {
  try {
    const [centers] = await db.query('SELECT * FROM centers');
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ message: 'Error fetching centers' });
  }
});

// Add new center
router.post('/', authenticateToken, authorizeRole(['admin', 'staff']), async (req, res) => {
  try {
    const { name, location, working_hours, contact_info } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const [result] = await db.query(
      'INSERT INTO centers (name, location, working_hours, contact_info) VALUES (?, ?, ?, ?)',
      [name, location, working_hours, contact_info]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      location,
      working_hours,
      contact_info
    });
  } catch (error) {
    console.error('Error adding center:', error);
    res.status(500).json({ message: 'Error adding center' });
  }
});

// Update center
router.put('/:id', authenticateToken, authorizeRole(['admin', 'staff']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, working_hours, contact_info } = req.body;

    const [result] = await db.query(
      'UPDATE centers SET name = ?, location = ?, working_hours = ?, contact_info = ? WHERE id = ?',
      [name, location, working_hours, contact_info, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json({
      id,
      name,
      location,
      working_hours,
      contact_info
    });
  } catch (error) {
    console.error('Error updating center:', error);
    res.status(500).json({ message: 'Error updating center' });
  }
});

// Delete center
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'staff']), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM centers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ message: 'Error deleting center' });
  }
});

module.exports = router; 