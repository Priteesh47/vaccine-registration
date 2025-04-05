const express = require('express');
const router = express.Router();
const centersController = require('../controllers/centersController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all centers
router.get('/', centersController.getAllCenters);

// Get single center
router.get('/:id', centersController.getCenter);

// Create center (staff only)
router.post('/', authenticateToken, authorizeRole(['Staff']), centersController.createCenter);

// Update center (staff only)
router.put('/:id', authenticateToken, authorizeRole(['Staff']), centersController.updateCenter);

// Delete center (staff only)
router.delete('/:id', authenticateToken, authorizeRole(['Staff']), centersController.deleteCenter);

module.exports = router; 