import React, { useEffect, useState } from "react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p className="text-center">Loading properties...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
      <div className="grid grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((prop) => (
            <div
              key={prop.id}
              className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={prop.cover_image || "https://via.placeholder.com/300"}
                alt={prop.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{prop.title}</h3>
                <p className="text-gray-600">{prop.location}</p>
                <p className="text-blue-600 font-bold mt-2">${prop.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No properties available</p>
        )}
      </div>
    </div>
  );
};

export default Properties;
