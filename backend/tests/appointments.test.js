const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

let token;
let doctorId;
let appointmentId;

beforeAll(async () => {
  // Use the same database for tests, but clean up before starting
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});

  // Create a test user (password will be hashed by pre-save hook)
  const user = new User({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'user'
  });
  await user.save();

  // Login to get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testuser@example.com', password: 'password123' });

  token = loginRes.body.token;

  // Create a test doctor
  const doctor = new Doctor({
    name: 'Dr. Test',
    specialty: 'Cardiology',
    experience: 10,
    available: true,
  });
  await doctor.save();
  doctorId = doctor._id.toString();
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});
});

describe('Appointments API', () => {
  test('Create appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Test User',
        doctor: doctorId,
        date: '2025-01-01',
        time: '10:00',
        reason: 'Test appointment',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.fullName).toBe('Test User');
    appointmentId = res.body._id;
  });

  test('Get user appointments', async () => {
    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Update appointment', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        reason: 'Updated reason',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.reason).toBe('Updated reason');
  });

  test('Delete appointment', async () => {
    const res = await request(app)
      .delete(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Appointment removed');
  });
});
