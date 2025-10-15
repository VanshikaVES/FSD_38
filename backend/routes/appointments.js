const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for logged-in user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialty')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', authenticate, async (req, res) => {
  const { fullName, date, time, doctor: doctorId, reason } = req.body;

  try {
    // Check if doctor exists and is available
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (!doctor.available) {
      return res.status(400).json({ message: 'Doctor is not available' });
    }

    // Check if the appointment date is in the current month
    const appointmentDate = new Date(date);
    const now = new Date();
    if (appointmentDate.getFullYear() !== now.getFullYear() || appointmentDate.getMonth() !== now.getMonth()) {
      return res.status(400).json({ message: 'Appointments can only be booked for the current month' });
    }

    // Check for conflicting appointments for the doctor at the same date and time
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
    }

    const appointment = new Appointment({
      user: req.user._id,
      fullName,
      date: new Date(date),
      time,
      doctor: doctorId,
      reason,
      status: 'pending',
    });

    await appointment.save();
    await appointment.populate('doctor', 'name specialty');

    // Emit real-time event to admins
    const io = req.app.get('io');
    io.to('admins').emit('newAppointment', {
      appointment: appointment,
      message: `New appointment request from ${appointment.fullName}`
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  const { fullName, date, time, doctor: doctorId, reason, status } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns the appointment or is admin
    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If updating doctor, check availability
    if (doctorId && doctorId !== appointment.doctor.toString()) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor || !doctor.available) {
        return res.status(400).json({ message: 'Doctor not available' });
      }
      appointment.doctor = doctorId;
    }

    // Update fields
    if (fullName) appointment.fullName = fullName;
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (status && req.user.role === 'admin') {
      appointment.status = status;

      // Emit real-time event to the user
      const io = req.app.get('io');
      io.to(`user_${appointment.user}`).emit('appointmentStatusUpdate', {
        appointment: appointment,
        message: `Your appointment status has been updated to ${status}`
      });
    }

    await appointment.save();
    await appointment.populate('doctor', 'name specialty');
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns the appointment or is admin
    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
