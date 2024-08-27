// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProcessPage from './components/ProcessPage';
import HelpSection from './components/HelpSection';
import './css/styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [nSegments, setNSegments] = useState(60);
  const [compactness, setCompactness] = useState(5);
  const [segmentedImage, setSegmentedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showHelp, setShowHelp] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadImage(selectedFile);
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      await axios.post('https://imagestyle.onrender.com/api/upload', formData);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const applySegmentation = async () => {
    if (!file) return;

    try {
      const response = await axios.post('https://imagestyle.onrender.com/api/segment', {
        image_path: `uploads/${file.name}`,
        n_segments: nSegments,
        compactness: compactness,
      });
      setSegmentedImage(response.data.path);
    } catch (error) {
      console.error('Error segmenting image:', error);
    }
  };

  useEffect(() => {
    if (file) {
      applySegmentation();
    }
  }, [nSegments, compactness]);

  return (
    <div className="App">
      <Header
        setCurrentPage={setCurrentPage}
        setShowHelp={setShowHelp}
        handleFileChange={handleFileChange} // Pass the file change handler
      />
      {showHelp && <HelpSection />}
      {currentPage === 'home' && (
        <HomePage file={file} handleFileChange={handleFileChange} />
      )}
      {currentPage === 'process' && file && (
        <ProcessPage
          file={file}
          nSegments={nSegments}
          setNSegments={setNSegments}
          compactness={compactness}
          setCompactness={setCompactness}
          segmentedImage={segmentedImage}
          setSegmentedImage={setSegmentedImage}
        />
      )}
    </div>
  );
}

export default App;
