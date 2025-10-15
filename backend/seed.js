require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-appointment');

    // Clear existing data
    await User.deleteMany();
    await Doctor.deleteMany();

    // Seed users
    const users = [
      { name: 'Admin User', email: 'admin@hospital.com', password: 'admin123', role: 'admin' },
      { name: 'John Doe', email: 'user1@hospital.com', password: 'user123', role: 'user' },
      { name: 'Jane Smith', email: 'user2@hospital.com', password: 'user456', role: 'user' },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`User ${user.name} created`);
    }

    // Seed doctors
    const doctors = [
      { name: 'Dr. Arjun Mehta', specialty: 'Cardiologist', experience: 12, image: 'https://via.placeholder.com/100?text=Doctor+1' },
      { name: 'Dr. Priya Sharma', specialty: 'Dermatologist', experience: 8, image: 'https://via.placeholder.com/100?text=Doctor+2' },
      { name: 'Dr. Rohan Kapoor', specialty: 'Orthopedic', experience: 10, image: 'https://via.placeholder.com/100?text=Doctor+3' },
      { name: 'Dr. Neha Verma', specialty: 'Pediatrician', experience: 6, image: 'https://via.placeholder.com/100?text=Doctor+4' },
    ];

    for (const doctorData of doctors) {
      const doctor = new Doctor(doctorData);
      await doctor.save();
      console.log(`Doctor ${doctor.name} created`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
