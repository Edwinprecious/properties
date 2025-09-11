import React, { useEffect, useState } from 'react';
import '../styles.css';
import './HeroSlider.css';  

const images = [
  '/images/Image_fx.jpg',
  '/images/val2.png',
  '/images/porsche.jpg',
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hero-slider"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="overlay">
        <h1>Find the right home <br />at the right price</h1>
        <div className="tabs">
          <button className="active">Buy</button>
          <button>Airbnb</button>
          <button>Sell</button>
          <button>Rent</button>
          {/* <button>My Home Value</button> */}
        </div>
        <div className="search-box">
          <input type="text" placeholder="City, Address, School, Agent, ZIP" />
          <button>🔍</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
