const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/userController");

// Register route
router.post("/signup", register);

// Login route
router.post("/login", login);

module.exports = router;