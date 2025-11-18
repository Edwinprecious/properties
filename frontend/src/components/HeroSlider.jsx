
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, ButtonGroup } from 'react-bootstrap';
import '../styles.css';
import './HeroSlider.css';

const images = [
  '/images/Image_fx.jpg',
  '/images/val2.png',
  '/images/porsche.jpg',
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Navigate to properties page with search query and category filter
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    if (activeTab) {
      params.append('category', activeTab);
    }

    // Navigate to properties page with filters
    navigate(`/properties?${params.toString()}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="hero-slider"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="overlay">
        <h1>Find the right home <br />at the right price</h1>

        {/* Category Tabs */}
        <ButtonGroup className="tabs mb-3">
          <Button
            variant={activeTab === 'buy' ? 'light' : 'secondary'}
            className={activeTab === 'buy' ? 'active' : ''}
            onClick={() => handleTabChange('buy')}
          >
            Buy
          </Button>
          <Button
            variant={activeTab === 'airbnb' ? 'light' : 'secondary'}
            className={activeTab === 'airbnb' ? 'active' : ''}
            onClick={() => handleTabChange('airbnb')}
          >
            Airbnb
          </Button>
          <Button
            variant={activeTab === 'sell' ? 'light' : 'secondary'}
            className={activeTab === 'sell' ? 'active' : ''}
            onClick={() => handleTabChange('sell')}
          >
            Sell
          </Button>
          <Button
            variant={activeTab === 'rent' ? 'light' : 'secondary'}
            className={activeTab === 'rent' ? 'active' : ''}
            onClick={() => handleTabChange('rent')}
          >
            Rent
          </Button>
        </ButtonGroup>

        {/* Search Form */}
        <Form className="search-box" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="City, Address, School, Agent, ZIP"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Button type="submit" className="search-btn">
            🔍
          </Button>
        </Form>

      </div>
    </div>
  );
};

export default HeroSlider;
