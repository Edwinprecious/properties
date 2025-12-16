import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const PopularCard = ({ 
  id, 
  slug, 
  model, 
  info, 
  address, 
  price, 
  image, 
  category 
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (slug) {
      navigate(`/properties/${slug}`);
    } else {
      navigate(`/properties/${id}`);
    }
  };

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      alert('Please login to save favorites');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ property_id: id })
      });

      if (response.ok) {
        alert('Added to favorites! ❤️');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="populars-cards" style={{ width: "100%" }}>
      <div className="populars-card" onClick={handleViewDetails} style={{ cursor: 'pointer' }}>
        {/* Image */}
        {/* {image} */}
        <img
          className="card-img-top"
          src={image ? `${API_BASE_URL}${image}` : '/images/Image_fx.jpg'}
          alt={model}
          onError={() => {
            const defaultImage = '/images/Image_fx.jpg';
            if (defaultImage) {
              this.setState({ image: defaultImage });
            }
          }}
        />

        {/* Category Badge */}
        {category && (
          <div className="badges">
            <span className="badge purple">{category.toUpperCase()}</span>
          </div>
        )}

        {/* Card Body */}
        <div className="popular-details">
          {/* Price */}
          <h3>₦{price?.toLocaleString()}</h3>
          
          {/* Title/Model */}
          <h5 className="model">{model}</h5>
          
          {/* Info (beds/baths) */}
          <div className="info">{info}</div>
          
          {/* Address */}
          <div className="address">
            <i className="bi bi-geo-alt"></i> {address}
          </div>

         

          {/* Favorite Button - MORE VISIBLE */}
          <div className="actions">
            <button 
              className="favorite-btn"
              onClick={handleAddToFavorites}
              title="Add to favorites"
              style={{
                background: 'transparent',
                border: '2px solid var(--primary-purple)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              

              <span style={{ fontSize: '1rem', color: 'var(--primary-purple)' }}>♡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCard;
