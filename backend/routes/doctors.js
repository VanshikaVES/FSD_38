const express = require('express');
const Doctor = require('../models/Doctor');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/doctors
// @desc    Add a new doctor
// @access  Private/Admin
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  const { name, specialty, experience, image } = req.body;
  try {
    const doctor = new Doctor({ name, specialty, experience, image });
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private/Admin
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    await doctor.remove();
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
