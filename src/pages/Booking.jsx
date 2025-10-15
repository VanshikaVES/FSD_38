// src/pages/Booking.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Booking() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    date: "",
    time: "",
    doctor: "",
    reason: "",
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [user]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">
          Please log in to view your bookings
        </h2>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments([...appointments, data]);
        setFormData({ fullName: "", date: "", time: "", doctor: "", reason: "" });
        toast.success("Booking confirmed successfully!");
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Toast container */}
      <ToastContainer />

      {/* User Info */}
      <div className="bg-blue-50 p-4 rounded-xl shadow mb-6">
        <p className="text-lg font-semibold">Welcome, {user.username}</p>
        <p className="text-sm text-gray-600">Role: {user.role}</p>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Book an Appointment
        </h2>

        {/* Full Name */}
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="block text-gray-700 mb-1">Select Doctor</label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-gray-700 mb-1">
            Reason for Appointment
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      {/* Booking History */}
      {loading ? (
        <div className="mt-8 text-center">Loading appointments...</div>
      ) : appointments.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Your Appointments
          </h3>
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="border p-4 rounded-lg shadow bg-gray-50"
              >
                <p className="font-semibold">{appt.fullName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(appt.date).toLocaleDateString()} at {appt.time}
                </p>
                <p className="text-sm">Doctor: {appt.doctor.name} ({appt.doctor.specialty})</p>
                <p className="text-sm">Reason: {appt.reason}</p>
                <p className="text-sm">Status: <span className={`font-semibold ${appt.status === 'confirmed' ? 'text-green-600' : appt.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`}>{appt.status}</span></p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">No appointments yet.</div>
      )}
    </div>
  );
}

export default Booking;
