import React, { useState, useEffect } from 'react';
import '../css/ProcessPage.css';

const ProcessPage = ({
  file,
  nSegments,
  setNSegments,
  compactness,
  setCompactness,
  segmentedImage,
  applySegmentation,
  isProcessing,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Utiliser useEffect pour détecter si l'utilisateur est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkMobile(); // Appel initial
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const downloadImage = async () => {
    if (!segmentedImage) return;

    try {
      const response = await fetch(`https://imagestyle.onrender.com/api/get_image/${segmentedImage}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `segmented_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="process-container">
      <div className="images-container">
        <div className="image-section">
          <h2>Image originelle</h2>
          <img src={URL.createObjectURL(file)} alt="Original" className="original-image" />
        </div>

        <div className="image-section image-section-right">
          <h2>Image stylisée</h2>
          <img src={`https://imagestyle.onrender.com/api/get_image/${segmentedImage}`} alt="Segmented" className="segmented-image" />

          {segmentedImage && (
            <button className="download-button" onClick={downloadImage}>
              Download
            </button>
          )}
        </div>
      </div>

      <div className="parameters-download-container">
        <div className="text-container">
          <p>Nombre de segments: {nSegments}</p>
          <p>Compactness: {compactness}</p>
        </div>

        <div className="sliders-container">
          {!isMobile ? (
            <>
              {/* Affichage des sliders pour les grands écrans */}
              <div className="slider-container">
                <input
                  type="range"
                  value={nSegments}
                  onChange={(e) => setNSegments(Number(e.target.value))}
                  min="10"
                  max="500"
                />
              </div>

              <div className="slider-container">
                <input
                  type="range"
                  value={compactness}
                  onChange={(e) => setCompactness(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </>
          ) : (
            <>
              {/* Affichage des champs de saisie manuelle pour les mobiles */}
              <div className="input-container">
                <input
                  type="number"
                  value={nSegments}
                  onChange={(e) => setNSegments(Number(e.target.value))}
                  min="10"
                  max="500"
                />
              </div>

              <div className="input-container">
                <input
                  type="number"
                  value={compactness}
                  onChange={(e) => setCompactness(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            </>
          )}
        </div>

        <button className="apply-button" onClick={applySegmentation} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

export default ProcessPage;
