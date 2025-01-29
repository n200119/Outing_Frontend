import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyOuting = () => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [studentName, setStudentName] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];
    setDate(todayFormatted); // Set default date to today

    // Calculate the date 7 days from today
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);
    const maxDateFormatted = maxDate.toISOString().split("T")[0];

    // Set the min and max dates in the date input constraints
    setMinDate(todayFormatted);
    setMaxDate(maxDateFormatted);

    // Retrieve and set student name from localStorage
    const nameFromStorage = localStorage.getItem("studentName");
    if (nameFromStorage) {
      setStudentName(nameFromStorage);
    }
  }, []);

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("studentLoginToken");

    const outingData = {
      date,
      reason,
      studentName,
      year,
    };

    try {
      const response = await fetch("https://outing-backend-83sg.onrender.com/outing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(outingData),
      });

      const newData = await response.json();
      if (response.ok) {
        toast.success("Outing applied successfully!");
        setDate(minDate); // Reset to today
        setReason("");
        setYear("");
        setTimeout(() => navigate("/welcome"), 2000);
      } else {
        toast.error(newData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full flex flex-col justify-between"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Apply for Outing
        </h2>

        <label className="block text-gray-700 font-semibold mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded mb-4"
          required
          min={minDate}
          max={maxDate}
        />

        <label className="block text-gray-700 font-semibold mb-2">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for outing"
          className="w-full border-2 border-gray-300 p-2 rounded mb-4"
          required
        />

        <label className="block text-gray-700 font-semibold mb-2">
          Student Name
        </label>
        <input
          type="text"
          value={studentName}
          disabled // Make the field read-only
          className="w-full border-2 border-gray-300 p-2 rounded mb-4 bg-gray-100 cursor-not-allowed"
        />

        {/* Year Dropdown */}
        <label className="block text-gray-700 font-semibold mb-2">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded mb-4"
          required
        >
          <option value="" disabled>
            Select Year
          </option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="E1">E1</option>
          <option value="E2">E2</option>
          <option value="E3">E3</option>
          <option value="E4">E4</option>
        </select>

        {/* Button Group */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/welcome")}
            className="w-1/2 bg-gray-800 text-white py-2 mr-2 rounded font-semibold hover:bg-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-gray-800 text-white py-2 ml-2 rounded font-semibold hover:bg-gray-900"
          >
            Apply Outing
          </button>
        </div>
      </form>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ApplyOuting;
