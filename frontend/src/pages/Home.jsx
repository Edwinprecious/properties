
import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import HeroSlider from '../components/HeroSlider';
import PopularCard from '../components/PopularCard';
import '../styles.css';
import Popular from '../Popular';
import OptionsCard from '../components/OptionsCard';
import Insta from '../components/Insta';
import TalkAgent from '../components/TalkAgent';
import Navbar from '../components/NavBar';
import { fetchRecentProperties } from '../services/api';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentProperties();
  }, []);

  const loadRecentProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch 3 most recent properties from backend
      const data = await fetchRecentProperties(3);
      
      setProperties(data.data || []);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <HeroSlider />
      
      {/* Popular in Lagos Section */}
      <div className="popular-sec">
        <div className="populars">
          <h2>Popular in Lagos</h2>
          <p>The most recently added homes.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading properties...</span>
            </Spinner>
            <p className="mt-3 text-muted">Loading recent properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="danger" className="mx-auto" style={{ maxWidth: '600px' }}>
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadRecentProperties}>
              Try Again
            </button>
          </Alert>
        )}

        {/* Success State */}
      <div className="populars-cards">
        {/* {properties.map((house) => (
          console.log(house),
            <PopularCard
            key={house.id}
            model={house.models}
            info={house.info}
            address={house.address}
              image={house.image}
            />
        ))} */}

         {/* Properties Grid */}
        {!loading && !error && (
          <div className="populars-cards">
            {properties.length > 0 ? (
              <>
                {properties.map((property) => (
                  <PopularCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    model={property.title}
                    info={`${property.bedrooms || 0} beds  •  ${property.bathrooms || 0} baths`}
                    address={property.address || property.location}
                    price={property.price}
                    image={property.image_url}
                    category={property.category}
                  />
                ))}
              </>
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        )}

         {/* <div className="recommendation-card populars-cards">
          <img src="/images/Image_fx.jpg" alt="background"className="recommendation-bg" />
          <div className="recommendation-overlay">
            <h3>See other more<br />recommendations</h3>
            <button className="recommendation-btn">Join or sign in</button>
          </div>
        </div>  */}
      </div> 
      
      

     </div>   
  
    <OptionsCard/>
    <Insta/>
    <TalkAgent/>
    

    </>
   
  );
};

export default Home;