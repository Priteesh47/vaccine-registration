const Vaccine = require('../models/Vaccine');
const { validationResult } = require('express-validator');

// Get all vaccines
exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find().sort({ name: 1 });
    res.json(vaccines);
  } catch (error) {
    console.error('Error in getVaccines:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new vaccine
exports.addVaccine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      manufacturer,
      dosageRequired,
      daysUntilNextDose,
      ageGroup,
      sideEffects,
      price,
      stockAvailable
    } = req.body;

    // Check if vaccine already exists
    let vaccine = await Vaccine.findOne({ name });
    if (vaccine) {
      return res.status(400).json({ message: 'Vaccine already exists' });
    }

    // Create new vaccine
    vaccine = new Vaccine({
      name,
      description,
      manufacturer,
      dosageRequired,
      daysUntilNextDose,
      ageGroup,
      sideEffects,
      price,
      stockAvailable
    });

    await vaccine.save();
    res.status(201).json(vaccine);
  } catch (error) {
    console.error('Error in addVaccine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vaccine
exports.updateVaccine = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }

    const {
      name,
      description,
      manufacturer,
      dosageRequired,
      daysUntilNextDose,
      ageGroup,
      sideEffects,
      price,
      stockAvailable
    } = req.body;

    // Check if new name already exists (excluding current vaccine)
    if (name !== vaccine.name) {
      const nameExists = await Vaccine.findOne({ name });
      if (nameExists) {
        return res.status(400).json({ message: 'Vaccine name already exists' });
      }
    }

    // Update fields
    vaccine.name = name;
    vaccine.description = description;
    vaccine.manufacturer = manufacturer;
    vaccine.dosageRequired = dosageRequired;
    vaccine.daysUntilNextDose = daysUntilNextDose;
    vaccine.ageGroup = ageGroup;
    vaccine.sideEffects = sideEffects;
    vaccine.price = price;
    vaccine.stockAvailable = stockAvailable;

    await vaccine.save();
    res.json(vaccine);
  } catch (error) {
    console.error('Error in updateVaccine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete vaccine
exports.deleteVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    if (!vaccine) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }

    await vaccine.remove();
    res.json({ message: 'Vaccine removed' });
  } catch (error) {
    console.error('Error in deleteVaccine:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 