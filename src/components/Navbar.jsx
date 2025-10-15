import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // assuming you have this hook/context

function Navbar() {
  const { user, logout } = useAuth(); // user has { role: "user" | "admin", username }

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="flex space-x-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/doctors">Doctors</Link>

        {/* ✅ Show Dashboard link for user role */}
        {user?.role === "user" && <Link to="/dashboard">Dashboard</Link>}

        {/* ✅ Show Admin link for admin role */}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {/* ✅ Show Chat link for users */}
        {user?.role === "user" && (
          <Link to="/booking" className="flex items-center gap-1">
            💬 Support
          </Link>
        )}

        {/* ✅ Right side: login/logout */}
        <div className="ml-auto">
          {user ? (
            <>
              <span className="mr-4">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
