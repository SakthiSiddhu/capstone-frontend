import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequestsByRequestName, fetchRequestById } from '../redux/trainingSlice'; // Adjust the import path if necessary
import { Link } from 'react-router-dom';

const AccountTeamDashboard = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.training);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(fetchRequestsByRequestName('John Doe')); // Adjust the parameter if necessary
  }, [dispatch]);

  const handleViewDetails = (requestId) => {
    dispatch(fetchRequestById(requestId))
      .unwrap()
      .then((data) => setSelectedRequest(data))
      .catch((error) => console.error('Failed to fetch request details:', error));
  };

  const handleBackToDashboard = () => {
    setSelectedRequest(null);
  };

  // Calculate total, completed, and pending requests
  const totalRequests = requests.length;
  const completedRequests = requests.filter((req) => req.status === 'COMPLETED').length;
  const pendingRequests = totalRequests - completedRequests;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const validRequests = Array.isArray(requests) ? requests : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome, Manager</h1>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Requests</h2>
          <p className="text-3xl font-bold">{totalRequests}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Completed Requests</h2>
          <p className="text-3xl font-bold">{completedRequests}</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Pending Requests</h2>
          <p className="text-3xl font-bold">{pendingRequests}</p>
        </div>
      </div>

      <Link to="/create-request">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6 block mx-auto">
          Create New Request
        </button>
      </Link>

      {/* Request Details or List */}
      {selectedRequest ? (
        <div className="p-6 bg-white shadow rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Request Details</h2>
          <p><strong>Course Name:</strong> {selectedRequest.coursename}</p>
          <p><strong>Position:</strong> {selectedRequest.employeeposition}</p>
          <p><strong>Description:</strong> {selectedRequest.description}</p>
          <p><strong>Concepts:</strong> {selectedRequest.concepts}</p>
          <p><strong>Duration:</strong> {selectedRequest.duration}</p>
          <p><strong>Status:</strong> {selectedRequest.status}</p>
          <p><strong>Employees Required:</strong> {selectedRequest.requiredemployees}</p>
          <p><strong>Created Date:</strong> {new Date(selectedRequest.createddate).toLocaleDateString()}</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6 block mx-auto"
          >
            Back
          </button>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg mt-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold">Training Program</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Position</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Status</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Created Date</th>
              <th className="py-2 px-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {validRequests.length > 0 ? (
              validRequests.map((request) => (
                <tr key={request.requestid} className="border-b">
                  <td className="py-2 px-4">{request.coursename}</td>
                  <td className="py-2 px-4">{request.employeeposition}</td>
                  <td className="py-2 px-4">{request.status}</td>
                  <td className="py-2 px-4">{new Date(request.createddate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewDetails(request.requestid)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountTeamDashboard;
