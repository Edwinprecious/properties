import React, { useEffect, useState } from "react";
import "./Properties.css";


const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let url = "http://127.0.0.1:5000/api/properties?";
        if (category) url += `category=${category}&`;
        if (search) url += `search=${search}&`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch properties");

        const data = await response.json();
        setProperties(data.data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [category, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
    <div className="properties-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="properties-header">
          <h1>Houses for Sale Near Me</h1>
          <p>
            Find houses for sale near you. View photos, open house information, 
            and property details for nearby real estate.
          </p>
        </div>
  
        {/* Filters Section */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
  
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="rent">Rent</option>
            <option value="sell">Sell</option>
            <option value="land">Land</option>
            <option value="airbnb">Airbnb</option>
            <option value="buy">Buy</option>
          </select>
  
          <button onClick={() => console.log("Search clicked")}>
            Search
          </button>
        </div>
  
        {/* Properties Grid Section */}
        <div className="properties-grid">
          {properties.length > 0 ? (
            properties.map((prop) => (
              <div
                key={prop.id}
                className="property-card"
                onClick={() =>
                  (window.location.href = `/properties/${prop.slug || prop.id}`)
                }
              >
                <div className="relative">
                  <img
                    src={prop.image_url || "https://via.placeholder.com/300"}
                    alt={prop.title}
                  />
                  <span className="listing-badge">Listed by Valerie</span>
                  {prop.status === "open" && (
                    <span className="walkthrough-badge">3D Walkthrough</span>
                  )}
                </div>
  
                <div className="property-details">
                  <h3>{prop.title}</h3>
                  <p>{prop.location}</p>
                  <p className="price">₦{prop.price?.toLocaleString()}</p>
  
                  <div className="property-tags">
                    {prop.bedrooms && <span>🛏️ {prop.bedrooms} beds</span>}
                    {prop.bathrooms && <span>🚿 {prop.bathrooms} baths</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500 text-lg">No properties found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Properties;
