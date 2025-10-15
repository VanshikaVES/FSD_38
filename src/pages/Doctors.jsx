import React, { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorCard";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      } else {
        setError("Failed to load doctors");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading doctors...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-10">👨‍⚕️ Meet Our Doctors</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc._id}
            name={doc.name}
            specialty={doc.specialty}
            image={doc.image}
            experience={doc.experience}
          />
        ))}
      </div>
    </div>
  );
}
