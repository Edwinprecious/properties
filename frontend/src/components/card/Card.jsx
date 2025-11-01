import React from 'react';
import { Link } from 'react-router-dom';
import './card.scss';

const Card = ({item}) => {
  return (
    <div className='card'>
      <Link to={`/property/${item.id}`} className='imageContainer'>
        <img src={item.image_url || item.cover_image || '/placeholder.jpg'} alt={item.title} />
      </Link>
      <div className='textContainer'>
        <h2 className='title'>
          <Link to={`/property/${item.id}`}>{item.title}</Link>
        </h2>
        <p className='address'>
          <img src="/pin.png" alt="" />
          <span>{item.address || item.location}</span>
        </p>
        <p className='price'>${item.price}</p>
        <div className='bottom'>
          <div className='features'>
            <div className='feature'>
              <img src="/bed.png" alt="" />
              <span>{item.bedroom || 0} bedroom</span>
            </div>
            <div className='feature'>
              <img src="/bath.png" alt="" />
              <span>{item.bathroom || 0} bathroom</span>
            </div>
          </div>
          <div className='icons'>
            <div className='icon'>
              <img src="/save.png" alt="" />
            </div>
            <div className='icon'>
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;