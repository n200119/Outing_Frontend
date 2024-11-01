import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { format } from "date-fns";

const CaretakerWelcome = () => {
  const navigate = useNavigate();
  const [outings, setOutings] = useState([]);
  const [caretakerName, setCaretakerName] = useState("Caretaker");
  const [studentIds, setStudentIds] = useState({});
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");

  // New search states
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchOutings = async () => {
      try {
        const token = localStorage.getItem("caretakerLoginToken");
        const response = await fetch("http://localhost:3000/outing/all-outings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setOutings(data.outings);
        updateStats(data.outings);
        fetchStudentIds(data.outings);
      } catch (error) {
        console.error("Error fetching outing data:", error);
      }
    };

    const getCareTakerName = async () => {
      try {
        const token = localStorage.getItem("caretakerLoginToken");
        const response = await fetch("http://localhost:3000/careTaker/singleCareTaker", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setCaretakerName(data.careTaker.name);
      } catch (error) {
        console.error("Error fetching caretaker data:", error);
      }
    };

    fetchOutings();
    getCareTakerName();
  }, []);

  const fetchStudentIds = async (outings) => {
    try {
      const token = localStorage.getItem("caretakerLoginToken");
      const ids = {};
      for (const outing of outings) {
        const response = await fetch(`http://localhost:3000/student/${outing.studentId._id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const studentData = await response.json();
        ids[outing.studentId._id] = studentData.student.email.substring(0, 7);
      }
      setStudentIds(ids);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const updateStats = (outings) => {
    const totalRequests = outings.length;
    const pending = outings.filter((outing) => outing.outingStatus === "pending").length;
    const accepted = outings.filter((outing) => outing.outingStatus === "accepted").length;
    const rejected = outings.filter((outing) => outing.outingStatus === "rejected").length;

    setStats({ totalRequests, pending, accepted, rejected });
  };

  const handleLogout = () => {
    localStorage.removeItem("caretakerLoginToken");
    navigate("/");
  };

  const updateOutingStatus = async (outingId, status) => {
    try {
      const token = localStorage.getItem("caretakerLoginToken");
      const response = await fetch(`http://localhost:3000/outing/${outingId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          outingStatus: status,
          intime: null,
          outtime: null,
        }),
      });

      if (response.ok) {
        setOutings((prevOutings) => {
          const updatedOutings = prevOutings.map((outing) =>
            outing._id === outingId ? { ...outing, outingStatus: status } : outing
          );
          updateStats(updatedOutings);
          return updatedOutings;
        });
      } else {
        console.error("Failed to update outing status");
      }
    } catch (error) {
      console.error("Error updating outing status:", error);
    }
  };

  // Filtered outings based on search and status
  const filteredOutings = outings.filter((outing) => {
    const matchesStatus = selectedStatus === "all" || outing.outingStatus === selectedStatus;
    const matchesName = outing.studentName.toLowerCase().includes(searchName.toLowerCase());
    const matchesId = studentIds[outing.studentId._id]?.startsWith(searchId);
    const matchesYear = searchYear === "" || outing.year.toString() === searchYear;
    const matchesDate = searchDate === "" || format(new Date(outing.date), "yyyy-MM-dd") === searchDate;

    return matchesStatus && matchesName && matchesId && matchesYear && matchesDate;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-700">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Welcome, {caretakerName}</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </header>

        {/* Search Filters */}
        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer" onClick={() => setSelectedStatus('all')}>
            <h3 className="text-xl font-semibold text-gray-700">Total Requests</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.totalRequests}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer" onClick={() => setSelectedStatus('pending')}>
            <h3 className="text-xl font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer" onClick={() => setSelectedStatus('accepted')}>
            <h3 className="text-xl font-semibold text-gray-700">Accepted Requests</h3>
            <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer" onClick={() => setSelectedStatus('rejected')}>
            <h3 className="text-xl font-semibold text-gray-700">Rejected Requests</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by Student Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Search by Student ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Search by Year"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-700">{selectedStatus.toUpperCase()} Outing Requests</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr className="text-left border-b">
                  <th className="px-6 py-3 font-semibold text-gray-600">#</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Student ID</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Student Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Year</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutings.map((outing, index) => (
                  <tr key={outing._id} className="hover:bg-gray-100 transition duration-150">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{studentIds[outing.studentId._id]}</td>
                    <td className="px-6 py-4">{outing.studentName}</td>
                    <td className="px-6 py-4">{outing.year}</td>
                    <td className="px-6 py-4">{format(new Date(outing.date), "yyyy-MM-dd")}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{outing.reason}</td>
                    <td className={`px-6 py-4 font-semibold ${
                      outing.outingStatus === 'pending' ? 'text-yellow-500' :
                      outing.outingStatus === 'accepted' ? 'text-green-600' :
                      outing.outingStatus === 'rejected' ? 'text-red-600' : ''
                    }`}>
                      {outing.outingStatus}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => updateOutingStatus(outing._id, "accepted")} className="px-4 py-1 mr-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                        Approve
                      </button>
                      <button onClick={() => updateOutingStatus(outing._id, "rejected")} className="px-4 py-1 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaretakerWelcome;
