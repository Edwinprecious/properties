import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, [categoryFilter]);

  const fetchProperties = async () => {
    try {
      let url = 'http://127.0.0.1:5000/api/properties';
      if (categoryFilter) {
        url += `?category=${categoryFilter}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:5000/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Property deleted successfully!');
        fetchProperties(); // Refresh list
      } else {
        alert('Failed to delete property');
      }
    } catch (err) {
      alert('Error deleting property: ' + err.message);
    }
  };

  const filteredProperties = properties.filter(prop =>
    prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
            <p className="text-gray-600 mt-2">{properties.length} total properties</p>
          </div>
          <button
            onClick={() => navigate('/admin/properties/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition"
          >
            ➕ Add New Property
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="rent">Rent</option>
              <option value="sell">Sell</option>
              <option value="land">Land</option>
              <option value="airbnb">Airbnb</option>
              <option value="buy">Buy</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Image</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Title</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Location</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Price</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Category</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <img
                          src={property.image_url ? `http://127.0.0.1:5000${property.image_url}` : 'https://via.placeholder.com/80'}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-6 text-gray-900 font-medium">{property.title}</td>
                      <td className="py-3 px-6 text-gray-600">📍 {property.location}</td>
                      <td className="py-3 px-6 text-gray-900 font-semibold">
                        ₦{property.price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full capitalize">
                          {property.category}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-3 py-1 text-xs rounded-full capitalize ${
                          property.status === 'active' ? 'bg-green-100 text-green-600' :
                          property.status === 'sold' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No properties found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProperties;