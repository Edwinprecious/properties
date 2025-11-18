
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Display search and category
  return (
    <div className="container py-5">
      <h1>Search Results</h1>
      {category && <p>Category: {category}</p>}
      {search && <p>Search: {search}</p>}
      
      // TODO: Fetch and display properties based on filters
    </div>
  );
};

export default PropertiesPage;