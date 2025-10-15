import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // ✅ Simple hardcoded login for now
    if (email === "admin@gmail.com" && password === "admin123") {
      login("Admin User", "admin"); // Save role = admin
      navigate("/admin");
    } else if (email === "user@gmail.com" && password === "user123") {
      login("Normal User", "user"); // Save role = user
      navigate("/booking");
    } else {
      setError("Invalid credentials! Try admin@gmail.com/admin123 or user@gmail.com/user123");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3"
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        
        {/* Test Credentials */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p><strong>Admin:</strong> admin@gmail.com / admin123</p>
          <p><strong>User:</strong> user@gmail.com / user123</p>
        </div>
      </form>
    </div>
  );
}
