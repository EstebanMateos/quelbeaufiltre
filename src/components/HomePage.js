// src/components/HomePage.js
import React from 'react';

const HomePage = ({ file, handleFileChange }) => {
  return (
    <div className="home-page">
      {!file && (
        <div>
          <h2>Welcome! Please upload an image to get started.</h2>
          <input type="file" onChange={handleFileChange} />
        </div>
      )}

      {file && (
        <div>
          <h2>Original Image</h2>
          <img
            src={URL.createObjectURL(file)}
            alt="Original"
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
