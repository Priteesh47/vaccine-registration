const db = require('../config/database');

// Get all vaccines
const getAllVaccines = async (req, res) => {
  try {
    const [vaccines] = await db.query('SELECT * FROM vaccines');
    res.json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    res.status(500).json({ error: 'Failed to fetch vaccines' });
  }
};

// Get single vaccine
const getVaccine = async (req, res) => {
  try {
    const [vaccines] = await db.query('SELECT * FROM vaccines WHERE id = ?', [req.params.id]);
    
    if (vaccines.length === 0) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    res.json(vaccines[0]);
  } catch (error) {
    console.error('Error fetching vaccine:', error);
    res.status(500).json({ error: 'Failed to fetch vaccine' });
  }
};

// Create vaccine
const createVaccine = async (req, res) => {
  const { name, manufacturer, description, dosage, age_group, effectiveness } = req.body;

  if (!name || !manufacturer) {
    return res.status(400).json({ error: 'Name and manufacturer are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO vaccines (name, manufacturer, description, dosage, age_group, effectiveness) VALUES (?, ?, ?, ?, ?, ?)',
      [name, manufacturer, description || null, dosage || null, age_group || null, effectiveness || null]
    );

    const [newVaccine] = await db.query('SELECT * FROM vaccines WHERE id = ?', [result.insertId]);
    res.status(201).json(newVaccine[0]);
  } catch (error) {
    console.error('Error creating vaccine:', error);
    res.status(500).json({ error: 'Failed to create vaccine' });
  }
};

// Update vaccine
const updateVaccine = async (req, res) => {
  const { name, manufacturer, description, dosage, age_group, effectiveness } = req.body;

  try {
    const [existingVaccine] = await db.query('SELECT * FROM vaccines WHERE id = ?', [req.params.id]);
    if (existingVaccine.length === 0) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    await db.query(
      'UPDATE vaccines SET name = ?, manufacturer = ?, description = ?, dosage = ?, age_group = ?, effectiveness = ? WHERE id = ?',
      [
        name || existingVaccine[0].name,
        manufacturer || existingVaccine[0].manufacturer,
        description || existingVaccine[0].description,
        dosage || existingVaccine[0].dosage,
        age_group || existingVaccine[0].age_group,
        effectiveness || existingVaccine[0].effectiveness,
        req.params.id
      ]
    );

    const [updatedVaccine] = await db.query('SELECT * FROM vaccines WHERE id = ?', [req.params.id]);
    res.json(updatedVaccine[0]);
  } catch (error) {
    console.error('Error updating vaccine:', error);
    res.status(500).json({ error: 'Failed to update vaccine' });
  }
};

// Delete vaccine
const deleteVaccine = async (req, res) => {
  try {
    const [existingVaccine] = await db.query('SELECT * FROM vaccines WHERE id = ?', [req.params.id]);
    if (existingVaccine.length === 0) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }

    await db.query('DELETE FROM vaccines WHERE id = ?', [req.params.id]);
    res.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    console.error('Error deleting vaccine:', error);
    res.status(500).json({ error: 'Failed to delete vaccine' });
  }
};

module.exports = {
  getAllVaccines,
  getVaccine,
  createVaccine,
  updateVaccine,
  deleteVaccine
}; 