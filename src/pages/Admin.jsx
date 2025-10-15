import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminChat from "../components/AdminChat";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        toast.error("Failed to load appointments");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedAppt = await res.json();
        setAppointments(appointments.map(appt => appt._id === id ? updatedAppt : appt));
        toast.success(`Appointment ${status.toLowerCase()}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor = filterDoctor ? appt.doctor.name === filterDoctor : true;
    const matchesStatus = filterStatus ? appt.status === filterStatus : true;
    const matchesDate = filterDate ? new Date(appt.date).toLocaleDateString() === filterDate : true;
    return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
  });

  const doctors = [...new Set(appointments.map((appt) => appt.doctor.name))];

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div className="p-8 relative">
      <h1 className="text-3xl font-bold mb-6">
        👩‍⚕️ Admin Panel
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'appointments'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📅 Appointments
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'chat'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💬 Chat Support
        </button>
      </div>

      {activeTab === 'appointments' && (
        <>
          <h2 className="text-2xl font-bold mb-4">All Appointments</h2>

          {/* Notice */}
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
            <p className="font-bold">Notice:</p>
            <p>Appointments can only be booked for the current month. No appointments will be accepted for future months.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-4 py-2 flex-1 min-w-[200px]"
            />

            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">All Doctors</option>
              {doctors.map((doc, idx) => (
                <option key={idx} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border rounded px-4 py-2"
            />
          </div>

          {/* Appointment List */}
          {filteredAppointments.length === 0 ? (
            <p className="text-gray-600">No matching appointments found.</p>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className={`p-4 rounded-lg shadow flex justify-between items-center ${
                    appt.rescheduled
                      ? "bg-yellow-50 border-l-4 border-yellow-400"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <h2 className="font-bold text-lg">
                      {appt.doctor.name}{" "}
                      {appt.rescheduled && (
                        <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                          Rescheduled
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-600">
                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      Patient: {appt.user.name} ({appt.user.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appt.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : appt.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appt.status}
                    </span>

                    {appt.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(appt._id, "confirmed")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(appt._id, "cancelled")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'chat' && (
        <div className="h-96">
          <h2 className="text-2xl font-bold mb-4">Live Chat Support</h2>
          <p className="text-gray-600 mb-4">
            Chat with users in real-time. Click the chat button in the bottom-left corner to expand the chat interface.
          </p>
          <AdminChat />
        </div>
      )}
    </div>
  );
}
