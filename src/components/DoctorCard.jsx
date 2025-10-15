import React from "react";
import { Link } from "react-router-dom";

export default function DoctorCard({ name, specialty, image, experience }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-blue-600 font-semibold">{specialty}</p>
      <p className="text-gray-600 text-sm mt-1">{experience} years experience</p>
      <Link
        to="/booking"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Book Now
      </Link>
    </div>
  );
}
