const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const vaccinesController = require('../controllers/vaccinesController');

// Get all vaccines
router.get('/', vaccinesController.getAllVaccines);

// Create a new vaccine (staff only)
router.post('/', authenticateToken, authorizeRole(['Staff']), vaccinesController.createVaccine);

// Get vaccine by ID
router.get('/:id', vaccinesController.getVaccine);

// Update vaccine (staff only)
router.put('/:id', authenticateToken, authorizeRole(['Staff']), vaccinesController.updateVaccine);

// Delete vaccine (staff only)
router.delete('/:id', authenticateToken, authorizeRole(['Staff']), vaccinesController.deleteVaccine);

module.exports = router; 