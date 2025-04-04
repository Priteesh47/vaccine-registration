const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Dashboard routes
router.get("/stats", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.get("/vaccines", adminController.getAllVaccines);
router.get("/appointments", adminController.getAllAppointments);
router.get("/centers", adminController.getAllCenters);

module.exports = router; 