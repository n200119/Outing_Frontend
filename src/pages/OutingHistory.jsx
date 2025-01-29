import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWalking } from "react-icons/fa";

const OutingHistory = () => {
  const [outings, setOutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutings = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const token = localStorage.getItem("studentLoginToken");
        const response = await fetch(
          "https://outing-backend-83sg.onrender.com/outing/student",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const data = await response.json();

        const updatedOutings = await Promise.all(
          data.outings.map(async (outing) => {
            if (outing.careTakerId) {
              const caretakerResponse = await fetch(
                `https://outing-backend-83sg.onrender.com/careTaker/${outing.careTakerId}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                  },
                }
              );
              const caretakerData = await caretakerResponse.json();
              console.log(caretakerData);
              outing.caretakerName = caretakerData.careTaker.name;
            }

            outing.formattedDate = new Date(outing.date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return outing;
          })
        );

        setOutings(updatedOutings);
        console.log(outings);
      } catch (error) {
        console.error("Error fetching outing history:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOutings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        My Outings
      </h1>

      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <FaWalking className="text-4xl text-blue-500 animate-bounce" />
          <span className="ml-4 text-xl font-semibold text-gray-700">
            Fetching your outings...
          </span>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {outings.length ? (
            outings.map(
              (outing, index) =>
                outing.outingStatus !== "pending" && (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-gray-50 shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl rounded-lg p-6 border border-gray-200"
                  >
                    <p className="text-lg font-semibold text-blue-800 mb-2">
                      <strong>Date:</strong> {outing.formattedDate}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Reason:</strong> {outing.reason}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Out Time:</strong> {outing.outTime || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>In Time:</strong> {outing.inTime || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          outing.outingStatus === "accepted"
                            ? "text-green-600"
                            : outing.outingStatus === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {outing.outingStatus}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Caretaker Name:</strong>{" "}
                      {outing.caretakerName || "N/A"}
                    </p>
                  </div>
                )
            )
          ) : (
            <p className="text-gray-600 text-center">No outings found.</p>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/welcome")}
        className="mt-8 bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-900 transition-colors"
      >
        Back
      </button>
    </div>
  );
};

export default OutingHistory;
