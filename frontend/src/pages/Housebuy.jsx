import React from "react";
import "./Housebuy.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const Housebuy = () => {
  const houses = [
    {
      images: ["images/house1.jpg", "images/HomeFinance.png", "images/house3.jpg"],
      price: "$500,000",
      details: "2 beds • 2 baths • 1,253 sq ft",
      address: "111 S Morgan St #825, Chicago, IL 60607",
      badge: "VALERIE CLASSIC OPEN SAT, 11AM TO 1PM",
      walkthrough: true,
    },
    {
      images: ["images/house2.jpg", "images/house3.jpg", "images/house4.jpg"],
      price: "$590,000",
      details: "4 beds • 3.5 baths • 3,700 sq ft",
      address: "4738 S Champlain Ave, Chicago, IL 60615",
      badge: "VALERIE CLASSIC OPEN SUN, 11AM TO 1PM",
      walkthrough: true,
    },
    {
      images: ["images/house3.jpg", "images/house1.jpg"],
      price: "$219,000",
      details: "3 beds • 2 baths • 1,401 sq ft",
      address: "6823 S Dorchester Ave #2, Chicago, IL 60637",
      badge: "VALERIE CLASSIC OPEN SUN, 11AM TO 1PM",
      walkthrough: true,
    },
    {
      images: ["images/house4.jpg", "images/house1.jpg", "images/house2.jpg"],
      price: "$415,000",
      details: "2 beds • 2 baths • 1,691 sq ft",
      address: "4141 N Kedzie Ave #307, Chicago, IL 60618",
      badge: "LISTED BY VALERIE CLASSIC",
      walkthrough: true,
    },
  ];

  return (
    <>
      
      <div className="container">
        <div className="text-section">
          <h1>Houses for sale near me</h1>
          <h4>
            Find houses for sale near you. View photos, open <br />
            house information, and property details for nearby <br />
            real estate.
          </h4>

          <div className="search-container">
            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="City, Address, School, Agent, ZIP"
              />
            </div>

            <div className="field">
              <label>Price range</label>
              <div className="price-range">
                <select>
                  <option>No min</option>
                  <option>$50,000</option>
                  <option>$100,000</option>
                </select>
                <select>
                  <option>No max</option>
                  <option>$500,000</option>
                  <option>$1,000,000</option>
                </select>
              </div>
            </div>

          
            <button className="search-btn">Search</button>
          </div>
        </div>

        <div className="image-section">
          <img src="/images/logo.png" alt="search banner" />
        </div>
      </div>


      <section className="house-card-container">
        <h1>Chicago houses for sale</h1>
        <div className="card-display">
          {houses.map((house, index) => (
            <div className="house-card" key={index}>
              <div className="image-slider">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {house.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="image-wrapper">
                        <img src={img} alt={`house-${index}-${i}`} />
                        {house.badge && (
                          <span className="badge">{house.badge}</span>
                        )}
                        {house.walkthrough && (
                          <span className="walkthrough">3D WALKTHROUGH</span>
                        )}
                        <button className="favorite">♡</button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="card-body">
                <h2>{house.price}</h2>
                <p>{house.details}</p>
                <span>{house.address}</span>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="see-more">
          See all 6636 Chicago houses for sale
        </a>
      </section>
    </>
  );
};
