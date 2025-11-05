import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Fetching dashboard stats...');
      
      // ✅ Use localhost:5000 (match your Flask server)
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (response.status === 403) {
        alert('Access denied. Admin only.');
        navigate('/unauthorized');
        return;
      }

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error Loading Dashboard</p>
          <p>{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your real estate platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Properties</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.properties?.total || 0}
                </h3>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">🏠</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ₦{stats?.properties?.total_value?.toLocaleString() || 0} total value
            </p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.users?.total || 0}
                </h3>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Inquiries</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.inquiries?.total || 0}
                </h3>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>

          {/* Total Favorites */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Favorites</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.favorites?.total || 0}
                </h3>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/properties/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow transition"
          >
            ➕ Add New Property
          </button>
          
          <button
            onClick={() => navigate('/admin/properties')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg shadow transition"
          >
            📋 Manage Properties
          </button>
          
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg shadow transition"
          >
            📧 Manage Inquiries
          </button>
        </div>

        {/* Recent Properties */}
        {stats?.properties?.recent && stats.properties.recent.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Properties</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.properties.recent.map((prop) => (
                    <tr key={prop.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{prop.title}</td>
                      <td className="py-3 px-4 text-gray-600">{prop.location}</td>
                      <td className="py-3 px-4 text-gray-900">₦{prop.price?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded capitalize">
                          {prop.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
