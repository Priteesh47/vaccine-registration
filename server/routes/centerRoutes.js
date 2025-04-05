const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all centers
router.get('/', async (req, res) => {
  try {
    const [centers] = await db.query('SELECT * FROM vaccine_centers');
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});

// Create a new center (staff only)
router.post('/', authenticateToken, authorizeRole(['Staff']), async (req, res) => {
  try {
    const { name, address, city, state, phone, email } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!state) missingFields.push('state');
    if (!phone) missingFields.push('phone');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    const [result] = await db.query(
      'INSERT INTO vaccine_centers (name, address, city, state, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
      [name, address, city, state, phone, email]
    );

    const [newCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [result.insertId]);
    res.status(201).json(newCenter[0]);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ 
      error: 'Failed to create center',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get center by ID
router.get('/:id', async (req, res) => {
  try {
    const [centers] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    
    if (centers.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json(centers[0]);
  } catch (error) {
    console.error('Error fetching center:', error);
    res.status(500).json({ error: 'Failed to fetch center' });
  }
});

// Update center (staff only)
router.put('/:id', authenticateToken, authorizeRole(['Staff']), async (req, res) => {
  try {
    const { name, address, city, state, phone, email } = req.body;

    // Check if center exists
    const [existingCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    if (existingCenter.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    // Update center
    await db.query(
      'UPDATE vaccine_centers SET name = ?, address = ?, city = ?, state = ?, phone = ?, email = ? WHERE id = ?',
      [
        name || existingCenter[0].name,
        address || existingCenter[0].address,
        city || existingCenter[0].city,
        state || existingCenter[0].state,
        phone || existingCenter[0].phone,
        email || existingCenter[0].email,
        req.params.id
      ]
    );

    const [updatedCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    res.json(updatedCenter[0]);
  } catch (error) {
    console.error('Error updating center:', error);
    res.status(500).json({ error: 'Failed to update center' });
  }
});

// Delete center (staff only)
router.delete('/:id', authenticateToken, authorizeRole(['Staff']), async (req, res) => {
  try {
    // Check if center exists
    const [existingCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    if (existingCenter.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    // Delete center
    await db.query('DELETE FROM vaccine_centers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ error: 'Failed to delete center' });
  }
});

module.exports = router; 