const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const usersController = require('../controllers/usersController');
const vaccinesController = require('../controllers/vaccinesController');
const dashboardController = require('../controllers/dashboardController');

// User routes
router.get('/users', authenticateToken, usersController.getAllUsers);
router.get('/users/:id', authenticateToken, usersController.getUser);
router.post('/users', authenticateToken, usersController.createUser);
router.put('/users/:id', authenticateToken, usersController.updateUser);
router.delete('/users/:id', authenticateToken, usersController.deleteUser);

// Vaccine routes
router.get('/vaccines', authenticateToken, vaccinesController.getAllVaccines);
router.get('/vaccines/:id', authenticateToken, vaccinesController.getVaccine);
router.post('/vaccines', authenticateToken, vaccinesController.createVaccine);
router.put('/vaccines/:id', authenticateToken, vaccinesController.updateVaccine);
router.delete('/vaccines/:id', authenticateToken, vaccinesController.deleteVaccine);

// Dashboard statistics
router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

module.exports = router; 