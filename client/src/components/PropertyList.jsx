import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";

const API_URL = "https://hotel-booking-app-x553.onrender.com/api/properties";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/api/properties`);
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (properties.length === 0) return <p>No properties yet.</p>;

  return (
    <div className="grid gap-6 p-6 md:grid-cols-3">
      {properties.map((property) => (
        <HotelCard
          key={property._id}
          hotel={{
            name: property.name,
            description: property.location,
            _id: property._id,
            img:
              property.photos.length > 0
                ? `${API_URL}/${property.photos[0].replace(/\\/g, "/")}`
                : "https://via.placeholder.com/400x300?text=No+Image",
            imgname: property.name,
            // price: `NPR ${property.price}`,
            price: property.price,
          }}
        />
      ))}
    </div>
  );
};

export default PropertyList;