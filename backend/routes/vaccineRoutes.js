const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const staffAuth = require('../middleware/staffAuth');
const vaccineController = require('../controllers/vaccineController');

// @route   GET /api/vaccines
// @desc    Get all vaccines
// @access  Public
router.get('/', vaccineController.getVaccines);

// @route   POST /api/vaccines
// @desc    Add a new vaccine
// @access  Staff only
router.post(
  '/',
  [
    auth,
    staffAuth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('manufacturer', 'Manufacturer is required').not().isEmpty(),
      check('dosageRequired', 'Dosage required must be at least 1').isInt({ min: 1 }),
      check('daysUntilNextDose', 'Days until next dose must be at least 0').isInt({ min: 0 }),
      check('ageGroup', 'Age group is required').not().isEmpty(),
      check('sideEffects', 'Side effects information is required').not().isEmpty(),
      check('price', 'Price must be a positive number').isFloat({ min: 0 }),
      check('stockAvailable', 'Stock available must be a non-negative number').isInt({ min: 0 })
    ]
  ],
  vaccineController.addVaccine
);

// @route   PUT /api/vaccines/:id
// @desc    Update a vaccine
// @access  Staff only
router.put(
  '/:id',
  [
    auth,
    staffAuth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('manufacturer', 'Manufacturer is required').not().isEmpty(),
      check('dosageRequired', 'Dosage required must be at least 1').isInt({ min: 1 }),
      check('daysUntilNextDose', 'Days until next dose must be at least 0').isInt({ min: 0 }),
      check('ageGroup', 'Age group is required').not().isEmpty(),
      check('sideEffects', 'Side effects information is required').not().isEmpty(),
      check('price', 'Price must be a positive number').isFloat({ min: 0 }),
      check('stockAvailable', 'Stock available must be a non-negative number').isInt({ min: 0 })
    ]
  ],
  vaccineController.updateVaccine
);

// @route   DELETE /api/vaccines/:id
// @desc    Delete a vaccine
// @access  Staff only
router.delete('/:id', [auth, staffAuth], vaccineController.deleteVaccine);

module.exports = router; 