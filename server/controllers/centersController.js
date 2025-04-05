const db = require('../config/database');

// Get all centers
const getAllCenters = async (req, res) => {
  try {
    const [centers] = await db.query('SELECT * FROM vaccine_centers ORDER BY name');
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
};

// Get single center
const getCenter = async (req, res) => {
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
};

// Create center
const createCenter = async (req, res) => {
  const { name, address, city, state, phone, email } = req.body;

  // Validate required fields
  if (!name || !address || !city || !state || !phone || !email) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'address', 'city', 'state', 'phone', 'email']
    });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO vaccine_centers (name, address, city, state, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
      [name, address, city, state, phone, email]
    );

    const [newCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [result.insertId]);
    res.status(201).json(newCenter[0]);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ error: 'Failed to create center' });
  }
};

// Update center
const updateCenter = async (req, res) => {
  const { name, address, city, state, phone, email } = req.body;

  try {
    const [existingCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    if (existingCenter.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

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
};

// Delete center
const deleteCenter = async (req, res) => {
  try {
    const [existingCenter] = await db.query('SELECT * FROM vaccine_centers WHERE id = ?', [req.params.id]);
    if (existingCenter.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }

    await db.query('DELETE FROM vaccine_centers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ error: 'Failed to delete center' });
  }
};

module.exports = {
  getAllCenters,
  getCenter,
  createCenter,
  updateCenter,
  deleteCenter
}; 