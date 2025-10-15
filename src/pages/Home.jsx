import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          🏥 Welcome to MyHospital
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Book doctor appointments online, consult specialists, and manage your health 
          records easily – all in one place.
        </p>
        <Link
          to="/booking"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Book an Appointment
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-blue-100 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">👨‍⚕️ Expert Doctors</h3>
            <p className="text-gray-600">
              Our specialists are highly experienced across all medical fields.
            </p>
          </div>
          <div className="p-6 bg-blue-100 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">📅 Easy Scheduling</h3>
            <p className="text-gray-600">
              Book appointments with just a few clicks, anytime, anywhere.
            </p>
          </div>
          <div className="p-6 bg-blue-100 rounded-2xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">💊 Full Care</h3>
            <p className="text-gray-600">
              From consultations to lab tests and pharmacy – everything under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to book your visit?</h2>
        <Link
          to="/doctors"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-100"
        >
          Find a Doctor
        </Link>
      </section>
    </div>
  );
}
