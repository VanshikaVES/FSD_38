import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  // ------------------------
  // Existing states
  // ------------------------
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]); // ✅ existing
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errorAppointments, setErrorAppointments] = useState(null);

  // ------------------------
  // 🔐 New states for login
  // ------------------------
  const { user } = useContext(AuthContext); // get current user from AuthContext

  // ------------------------
  // Socket.IO for real-time updates
  // ------------------------
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Authenticate socket
    const token = localStorage.getItem("token");
    newSocket.emit("authenticate", token);

    // Listen for real-time updates
    newSocket.on("appointmentStatusUpdate", (data) => {
      const { appointment, message } = data;
      // Update appointments state
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointment._id ? appointment : appt
        )
      );
      // Add notification
      setNotifications((prev) => [
        { type: "status", message },
        ...prev,
      ]);
    });

    newSocket.on("newAppointment", (data) => {
      if (user.role === "admin") {
        const { message } = data;
        setNotifications((prev) => [
          { type: "new", message },
          ...prev,
        ]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // ------------------------
  // Existing functions
  // ------------------------

  // ➕ Add appointment
  const addAppointment = (appointment) => {
    const newAppt = {
      ...appointment,
      status: "Pending",
      rescheduled: false,
    };
    setAppointments((prev) => [...prev, newAppt]);

    // Notify admin
    setNotifications((prev) => [
      { type: "new", message: `New appointment request from ${appointment.name}` },
      ...prev,
    ]);
  };

  // ✅ Update status
  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus, rescheduled: false } : appt
      )
    );

    setNotifications((prev) => [
      { type: "status", message: `Appointment #${id} marked as ${newStatus}` },
      ...prev,
    ]);
  };

  // 🔄 Reschedule
  const rescheduleAppointment = (id, newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id
          ? {
              ...appt,
              date: newDate,
              time: newTime,
              status: "Pending",
              rescheduled: true,
            }
          : appt
      )
    );

    setNotifications((prev) => [
      {
        type: "reschedule",
        message: `Appointment #${id} was rescheduled and needs review`,
      },
      ...prev,
    ]);
  };

  // ------------------------
  // Fetch appointments for current user on user change
  // ------------------------
  useEffect(() => {
    if (!user) {
      setAppointments([]);
      return;
    }

    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      setErrorAppointments(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await res.json();
        // Filter appointments for current user if role is user
        let userAppointments = data;
        if (user.role === "user") {
          userAppointments = data.filter(
            (appt) => appt.user === user._id || appt.user === user.id || appt.user.toString() === user._id.toString() || appt.user.toString() === user.id.toString()
          );
        }
        setAppointments(userAppointments);
      } catch (error) {
        setErrorAppointments(error.message);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // ------------------------
  // Provider
  // ------------------------
  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateStatus,
        rescheduleAppointment,
        notifications,
        setNotifications,
        loadingAppointments,
        errorAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}
