import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // role mismatch
    return <Navigate to="/" />;
  }

  return children;
}
