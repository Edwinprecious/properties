
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryPage.css';

const RentProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, [filters.sortBy, filters.sortOrder]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Build query string
      let url = `http://localhost:5000/api/properties?category=rent`;
      
      if (filters.search) url += `&search=${filters.search}`;
      if (filters.location) url += `&location=${filters.location}`;
      if (filters.minPrice) url += `&min_price=${filters.minPrice}`;
      if (filters.maxPrice) url += `&max_price=${filters.maxPrice}`;
      if (filters.bedrooms) url += `&bedrooms=${filters.bedrooms}`;
      url += `&sort_by=${filters.sortBy}&sort_order=${filters.sortOrder}`;

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    setTimeout(() => fetchProperties(), 100);
  };

  const viewPropertyDetails = (slug) => {
    navigate(`/properties/${slug}`);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading properties for rent...</p>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Properties for Rent</h1>
          <p className="lead">Find your perfect rental home</p>
          <p className="mb-0">
            <i className="bi bi-house-door"></i> {properties.length} properties available
          </p>
        </div>
      </div>

      <div className="container my-5">
        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="bi bi-funnel"></i> Filter Properties
            </h5>
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                {/* Search */}
                <div className="col-md-6">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by title or description..."
                  />
                </div>

                {/* Location */}
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g., Lagos, Abuja..."
                  />
                </div>

                {/* Min Price */}
                <div className="col-md-3">
                  <label className="form-label">Min Price (₦)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="0"
                  />
                </div>

                {/* Max Price */}
                <div className="col-md-3">
                  <label className="form-label">Max Price (₦)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="1000000"
                  />
                </div>

                {/* Bedrooms */}
                <div className="col-md-3">
                  <label className="form-label">Bedrooms</label>
                  <select
                    className="form-select"
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="col-md-3">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                  >
                    <option value="created_at">Newest First</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-clockwise"></i> Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="row g-4">
            {properties.map((property) => (
              <div key={property.id} className="col-md-6 col-lg-4">
                <div className="card property-card h-100 shadow-sm">
                  {/* Image */}
                  <div className="position-relative">
                    <img
                      src={property.image_url ? `http://localhost:5000${property.image_url}` : 'https://via.placeholder.com/400x300'}
                      className="card-img-top"
                      alt={property.title}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                      For Rent
                    </span>
                  </div>

                  {/* Body */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{property.title}</h5>
                    
                    <p className="text-muted mb-2">
                      <i className="bi bi-geo-alt"></i> {property.location}
                    </p>

                    <h4 className="text-primary fw-bold mb-3">
                      ₦{property.price?.toLocaleString()}<small className="text-muted">/month</small>
                    </h4>

                    {/* Property Details */}
                    {(property.bedrooms || property.bathrooms) && (
                      <div className="d-flex gap-3 mb-3 text-muted">
                        {property.bedrooms && (
                          <span>
                            <i className="bi bi-door-closed"></i> {property.bedrooms} beds
                          </span>
                        )}
                        {property.bathrooms && (
                          <span>
                            <i className="bi bi-droplet"></i> {property.bathrooms} baths
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {property.description && (
                      <p className="card-text text-muted small mb-3">
                        {property.description.substring(0, 100)}...
                      </p>
                    )}

                    {/* Button */}
                    <button
                      className="btn btn-outline-primary mt-auto"
                      onClick={() => viewPropertyDetails(property.slug || property.id)}
                    >
                      View Details <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h3 className="mt-3">No Properties Found</h3>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentProperties;
