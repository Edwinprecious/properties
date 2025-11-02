import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        navigate('/unauthorized');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
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
            <div className="flex gap-2 mt-4 text-sm text-gray-500">
              {stats?.users?.by_role?.map((role, idx) => (
                <span key={idx}>
                  {role.role}: {role.count}
                </span>
              ))}
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
            <div className="flex gap-2 mt-4 text-sm text-gray-500">
              {stats?.inquiries?.by_status?.map((status, idx) => (
                <span key={idx}>
                  {status.status}: {status.count}
                </span>
              ))}
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

        {/* Properties by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Properties by Category</h3>
            <div className="space-y-3">
              {stats?.properties?.by_category?.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{cat.category}</span>
                  <span className="font-semibold text-gray-900">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
            <div className="space-y-3">
              {stats?.locations?.top_locations?.slice(0, 5).map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">{loc.location}</span>
                  <span className="font-semibold text-gray-900">{loc.count} properties</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
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
                {stats?.properties?.recent?.map((prop) => (
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
      </div>
    </div>
  );
};

export default AdminDashboard;