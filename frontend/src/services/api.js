const API_BASE_URL = 'http://localhost:5000';

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