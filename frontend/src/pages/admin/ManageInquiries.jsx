
import React, { useState, useEffect } from 'react';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      let url = 'http://127.0.0.1:5000/api/admin/inquiries';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiries(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:5000/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('Inquiry status updated!');
        fetchInquiries(); // Refresh list
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`http://127.0.0.1:5000/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Inquiry deleted successfully!');
        fetchInquiries();
      } else {
        alert('Failed to delete inquiry');
      }
    } catch (err) {
      alert('Error deleting inquiry: ' + err.message);
    }
  };

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Inquiries</h1>
          <p className="text-gray-600 mt-2">{inquiries.length} total inquiries</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Inquiries</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
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
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">User</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Property</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Message</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Date</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length > 0 ? (
                  inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.user_name_db}</p>
                          <p className="text-sm text-gray-600">{inquiry.user_email_db}</p>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <p className="font-medium text-gray-900">{inquiry.property_title}</p>
                        <p className="text-sm text-gray-600">📍 {inquiry.property_location}</p>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-gray-600 text-sm">
                          {inquiry.message.length > 50 
                            ? `${inquiry.message.substring(0, 50)}...`
                            : inquiry.message
                          }
                        </p>
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="text-blue-600 text-sm hover:underline mt-1"
                        >
                          View full message
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                          className={`px-3 py-1 text-xs rounded-full capitalize cursor-pointer ${
                            inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            inquiry.status === 'responded' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="responded">Responded</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Inquiry Details</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Property:</p>
                  <p className="text-gray-900">{selectedInquiry.property_title}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">From:</p>
                  <p className="text-gray-900">{selectedInquiry.user_name_db}</p>
                  <p className="text-sm text-gray-600">{selectedInquiry.user_email_db}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Message:</p>
                  <p className="text-gray-900 mt-1">{selectedInquiry.message}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Date:</p>
                  <p className="text-gray-900">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInquiries;