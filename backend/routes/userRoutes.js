const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('newPassword')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  userController.updateProfile
);

module.exports = router; 