import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWalking } from 'react-icons/fa';

const OutingStatus = () => {
  const [monthlyOutings, setMonthlyOutings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMonthlyOutings = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem('studentLoginToken');
        const response = await fetch('http://localhost:3000/outing/latestOuting', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });
        
        const data = await response.json();
        console.log(data);
        console.log(data.latestOuting);
        setMonthlyOutings(data.latestOuting); // Assume `latestOuting` is an array from the backend response
      } catch (error) {
        console.error('Error fetching monthly outings:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchMonthlyOutings();
  }, []);

  const cancelOuting = async (outingId) => {
    try {
      const token = localStorage.getItem('studentLoginToken');
      const response = await fetch(`http://localhost:3000/outing/cancel/${outingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });
      
      if (response.ok) {
        alert('Outing has been successfully canceled.');
        setMonthlyOutings(monthlyOutings.filter(outing => outing._id !== outingId)); // Remove the canceled outing
      } else {
        alert('Failed to cancel the outing. Please try again.');
      }
    } catch (error) {
      console.error('Error canceling outing:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Outing Status</h1>
      
      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <FaWalking className="text-4xl text-blue-500 animate-bounce" />
          <span className="ml-4 text-xl font-semibold text-gray-700">Loading outing status...</span>
        </div>
      ) : monthlyOutings.length > 0 ? (
        monthlyOutings.map((outing) => (
          <div key={outing._id} className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-lg p-8 border border-gray-200 transition-transform transform hover:scale-105 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Outing on {formatDate(outing.date)}</h2>
            
            <p className="text-lg font-semibold text-blue-800 mb-2"><strong>Date:</strong> {formatDate(outing.date)}</p>
            <p className="text-md text-gray-700 mb-1"><strong>Reason:</strong> {outing.reason}</p>
            <p className={`mt-2 text-md font-semibold ${getStatusStyle(outing.outingStatus)}`}>
              Status: {outing.outingStatus.charAt(0).toUpperCase() + outing.outingStatus.slice(1)}
            </p>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => cancelOuting(outing._id)}
                className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                Cancel Outing
              </button>
              <button
                onClick={() => navigate('/welcome')}
                className="bg-gray-700 text-white px-5 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center">
        <p className="mt-12 text-gray-600 text-center text-lg">No recent outings found for this month.</p>
        <button
                onClick={() => navigate('/welcome')}
                className="bg-gray-700 text-white px-5 py-2 mt-12 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
              >
                Back
              </button></div>
      )}
    </div>
  );
};

export default OutingStatus;
