import React from 'react';
import { useParams } from 'react-router-dom';

export const ImageSelector = () => {
  const { searchQuery } = useParams();
  return (
    <div>
      <h1>Image Selector</h1>
      <div>Search Query: {searchQuery}</div>
    </div>
  );
};
