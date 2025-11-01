import React, { useState, useEffect } from 'react';
import "./ListPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import { getProperties } from '../../lib/api';
import MapView from "../../components/map/MapView";



const ListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const properties = await getProperties();
        console.log('Fetched properties:', properties); // Check what we got
        setData(properties);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className='listpage'>
        <div className='listContainer'>
          <div className='wrapper'>
            <p>Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='listpage'>
        <div className='listContainer'>
          <div className='wrapper'>
            <p style={{color: 'red'}}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='listpage'>
      <div className='listContainer'>
        <div className='wrapper'>
          <Filter />
          {data.length === 0 ? (
            <p>No properties found</p>
          ) : (
            data.map(item => (
              <Card key={item.id} item={item} />
            ))
          )}
        </div>
      </div>
      <div className='mapContainer'>
      <MapView  items={data}/>
      </div>
    </div>
  );
}

export default ListPage;