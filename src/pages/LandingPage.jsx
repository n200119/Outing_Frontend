import React from "react";
import { useNavigate } from "react-router-dom";
import myImage from "../assets/rguktlogo.png"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-gray-100 relative">
      {/* Header with University Name and Logo */}
      <div className="absolute top-6 flex items-center justify-between w-full px-8">
        <img
          src={myImage}
          alt="University Logo"
          className="h-16 w-16"
        />
        <h1 className="text-2xl font-bold text-blue-700 text-center flex-grow">
          Rajiv Gandhi University of Knowledge Technologies, Nuzvid
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("studentLoginToken");
            localStorage.removeItem("studentName");
            navigate("/");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Section Heading */}
      <header className="text-center mb-8 mt-32">
        <h2 className="text-4xl font-semibold text-blue-700">
          Welcome to Outing System
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Plan and manage your outings effortlessly
        </p>
      </header>

      {/* Action Buttons */}
      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/apply")}
          className="bg-green-500 text-white px-6 py-2 rounded-full text-lg shadow-lg hover:bg-green-600"
        >
          Apply Outing
        </button>
        <button
          onClick={() => navigate("/status")}
          className="bg-yellow-500 text-white px-6 py-2 rounded-full text-lg shadow-lg hover:bg-yellow-600"
        >
          Outing Status
        </button>
        <button
          onClick={() => navigate("/history")}
          className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg shadow-lg hover:bg-blue-600"
        >
          Outing History
        </button>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        <p>© 2024 Outing System. All Rights Reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/support" className="hover:underline">
            Support
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
