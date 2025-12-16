// const API_BASE_URL = 'http://localhost:5000';
export const API_BASE_URL = "http://127.0.0.1:5000";

// const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * Fetch recently added properties
 * @param {number} limit - Number of properties to fetch
 * @returns {Promise} - Properties data
 */
export const fetchRecentProperties = async (limit = 3) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/properties?sort_by=created_at&sort_order=DESC&limit=${limit}&status=active`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recent properties:', error);
    throw error;
  }
};

/**
 * Fetch properties by location
 * @param {string} location - Location name
 * @param {number} limit - Number of properties to fetch
 * @returns {Promise} - Properties data
 */
export const fetchPropertiesByLocation = async (location, limit = 3) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/properties?location=${location}&sort_by=created_at&sort_order=DESC&limit=${limit}&status=active`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    throw error;
  }
};

// export const fetchPropertyDetails = async (propertyId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch property details');
//     }
    
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching property details:', error);
//     throw error;
//   }
// };


/**
 * Fetch admin dashboard statistics
 * @returns {Promise} - Dashboard stats data
 */
export const fetchAdminDashboardStats = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};


/**
 * Upload a single cover image
 * @param {File} file - Image file
 * @returns {Promise} - Uploaded image URL
 */
export const uploadCoverImage = async (file) => {
  const token = localStorage.getItem("access_token");
  const form = new FormData();
  form.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    throw new Error("Failed to upload cover image");
  }

  return await response.json(); // { image_url: "..." }
};


/**
 * Upload multiple images
 * @param {File[]} files - Array of image files
 * @returns {Promise} - Uploaded image URLs
 */
export const uploadAdditionalImages = async (files) => {
  const token = localStorage.getItem("access_token");
  const form = new FormData();
  files.forEach(file => form.append("images", file));

  const response = await fetch(`${API_BASE_URL}/api/admin/upload-images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    throw new Error("Failed to upload images");
  }

  return await response.json(); // { image_urls: [...] }
};


/**
 * Create a new property
 * @param {Object} propertyData - Property details
 * @returns {Promise} - Created property response
 */
export const createProperty = async (propertyData) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/api/admin/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create property");
  }

  return await response.json();
};




/**
 * Fetch properties (optionally filtered by category)
 */
export const fetchProperties = async (categoryFilter = "") => {
  let url = `${API_BASE_URL}/api/properties`;
  if (categoryFilter) {
    url += `?category=${categoryFilter}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch properties");
  return await response.json();
};

/**
 * Delete a property by ID
 */
export const deleteProperty = async (propertyId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/api/admin/properties/${propertyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete property");
  return await response.json();
};


/**
 * Fetch inquiries (optionally filtered by status)
 */
export const fetchInquiries = async (statusFilter = "") => {
  const token = localStorage.getItem("access_token");
  let url = `${API_BASE_URL}/api/admin/inquiries`;
  if (statusFilter) {
    url += `?status=${statusFilter}`;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch inquiries");
  return await response.json(); // { data: [...] }
};

/**
 * Update inquiry status
 */
export const updateInquiryStatus = async (inquiryId, newStatus) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/api/admin/inquiries/${inquiryId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) throw new Error("Failed to update inquiry status");
  return await response.json();
};

/**
 * Delete inquiry
 */
export const deleteInquiry = async (inquiryId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/api/admin/inquiries/${inquiryId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete inquiry");
  return await response.json();
};



/**
 * Fetch property details by ID
 */
export const fetchPropertyById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`);
  if (!response.ok) throw new Error("Property not found");
  return await response.json(); // { data: {...} }
};

/**
 * Update property by ID
 */
export const updateProperty = async (id, propertyData) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_BASE_URL}/api/admin/properties/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update property");
  }
  return await response.json();
};


