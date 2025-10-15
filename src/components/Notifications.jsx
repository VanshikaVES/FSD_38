import React, { useContext } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

export default function Notifications() {
  const { notifications, setNotifications } = useContext(AppointmentContext);

  const clearNotifications = () => setNotifications([]);

  return (
    <div className="fixed top-20 right-6 w-80 bg-white shadow-lg rounded-lg border p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">🔔 Notifications</h2>
        <button
          onClick={clearNotifications}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {notifications.map((note, idx) => (
            <li
              key={idx}
              className={`p-2 rounded text-sm ${
                note.type === "new"
                  ? "bg-green-100 text-green-700"
                  : note.type === "reschedule"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
