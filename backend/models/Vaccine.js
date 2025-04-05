const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  dosageRequired: {
    type: Number,
    required: true,
    min: 1
  },
  daysUntilNextDose: {
    type: Number,
    required: true,
    min: 0
  },
  ageGroup: {
    type: String,
    required: true
  },
  sideEffects: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockAvailable: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vaccine', vaccineSchema); 