const db = require('../config/db');

// Get all vaccines
const getAllVaccines = async (req, res) => {
    try {
        const [vaccines] = await db.query('SELECT * FROM vaccines ORDER BY name');
        res.json(vaccines);
    } catch (error) {
        console.error('Error fetching vaccines:', error);
        res.status(500).json({ message: 'Error fetching vaccines' });
    }
};

// Get vaccine by ID
const getVaccineById = async (req, res) => {
    try {
        const [vaccine] = await db.query('SELECT * FROM vaccines WHERE id = ?', [req.params.id]);
        if (vaccine.length === 0) {
            return res.status(404).json({ message: 'Vaccine not found' });
        }
        res.json(vaccine[0]);
    } catch (error) {
        console.error('Error fetching vaccine:', error);
        res.status(500).json({ message: 'Error fetching vaccine' });
    }
};

module.exports = {
    getAllVaccines,
    getVaccineById
}; 