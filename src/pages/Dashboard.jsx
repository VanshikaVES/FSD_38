import React, { useContext, useState, useEffect } from "react";
import { AppointmentContext } from "../context/AppointmentContext";
import Chat from "../components/Chat";

export default function Dashboard() {
  const { appointments, updateStatus, rescheduleAppointment } =
    useContext(AppointmentContext);

  // Filter state
  const [filterType, setFilterType] = useState("All");

  // Track reschedule inputs
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);

  // Get admin ID for chat
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const conversations = await res.json();
          if (conversations.length > 0) {
            setAdminId(conversations[0].user._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin ID:', error);
      }
    };

    fetchAdminId();
  }, []);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const filteredAppointments = appointments.filter((appt) => {
    if (filterType === "Upcoming") {
      return appt.date >= today;
    } else if (filterType === "Past") {
      return appt.date < today;
    }
    return true;
  });

  const handleReschedule = (id) => {
    if (newDate && newTime) {
      rescheduleAppointment(id, newDate, newTime);
      setEditingId(null);
      setNewDate("");
      setNewTime("");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📋 My Appointments</h1>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 z-40"
        title="Chat with Support"
      >
        💬
      </button>

      {/* Chat Component */}
      <Chat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        adminId={adminId}
      />

      {/* Filter buttons */}
      <div className="flex gap-4 mb-6">
        {["All", "Upcoming", "Past"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded ${
              filterType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <p className="text-gray-600">
          No {filterType.toLowerCase()} appointments found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 bg-white rounded-lg shadow flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg">{appt.doctor}</h2>
                  <p className="text-gray-600">
                    {appt.date} at {appt.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    Patient: {appt.name} ({appt.email})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appt.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status}
                  </span>

                  {/* Cancel button */}
                  {appt.status !== "Cancelled" && appt.date >= today && (
                    <button
                      onClick={() => updateStatus(appt.id, "Cancelled")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Reschedule button */}
                  {appt.status !== "Cancelled" && appt.date >= today && (
                    <button
                      onClick={() => setEditingId(appt.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Reschedule Form */}
              {editingId === appt.id && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => handleReschedule(appt.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
