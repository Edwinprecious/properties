const API_BASE_URL = 'http://localhost:5001/api';

// Get all properties (with optional filters)
export const getProperties = async (category = null, status = 'active') => {
  try {
    let url = `${API_BASE_URL}/properties?status=${status}`;

    if (category) {
      url += `&category=${category}`;
      // url = url + `&category=${category}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch properties');
    
    const data = await response.json();
    return data.data; // Returns the properties array
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

// Get single property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error('Property not found');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

// Get properties by location
export const getPropertiesByLocation = async (location) => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/location/${location}`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    return [];
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
    }

    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Signup user
export const signup = async (name, email, phone, password, confirm_password, role = 'user') => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password, confirm_password, role }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Get user favorites
export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch favorites');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// Add property to favorites
export const addFavorite = async (property_id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ property_id }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add favorite');
    }

    return data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Remove property from favorites
export const removeFavorite = async (property_id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/favorites/${property_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove favorite');
    }

    return data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

// Check if property is favorited
export const checkFavorite = async (property_id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/favorites/check/${property_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return false;
    
    const data = await response.json();
    return data.is_favorited;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch profile');
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Logout helper
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('role');
};

// ADMIN FUNCTIONS
// Create property (Admin only)
export const createProperty = async (propertyData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/admin/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create property');
    }

    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Update property (Admin only)
export const updateProperty = async (propertyId, propertyData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update property');
    }

    return data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

// Delete property (Admin only)
export const deleteProperty = async (propertyId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete property');
    }

    return data;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};