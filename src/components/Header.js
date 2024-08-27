// src/components/Header.js
import React, { useRef } from 'react';
import '../css/Header.css';

const Header = ({ setCurrentPage, setShowHelp, handleFileChange }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <header className="header flex justify-between items-center p-4 bg-gray-100 shadow">
      <div className="flex">
        <button onClick={() => setCurrentPage('home')} className="mr-2">
          Home
        </button>
        <button onClick={() => setShowHelp((prev) => !prev)} className="mr-2">
          Help
        </button>
        <button onClick={() => setCurrentPage('process')} className="mr-2">
          Process
        </button>
      </div>
      <div>
        <button onClick={handleButtonClick} className="mr-2">
          Change Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </header>
  );
};

export default Header;
