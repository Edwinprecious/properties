import React from 'react';
import { Marker, Popup } from "react-leaflet";  
import { Link } from "react-router-dom";  
import "./pin.scss";

const Pin = ({ item }) => { 
  if (!item.latitude || !item.longitude) {
    return null; 
  }

  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className='popupContainer'>
          <img src={item.image_url || item.cover_image} alt={item.title} />
          <div className='textContainer'>
            <Link to={`/property/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom || 0} bedroom</span>
            <b>${item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;