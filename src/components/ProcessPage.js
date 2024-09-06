import React, { useEffect } from 'react';
import '../css/ProcessPage.css';

const baseURL = "https://quelbeaufiltre.ey.r.appspot.com";

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
  useEffect(() => {
    // Afficher l'URL utilisée pour récupérer l'image segmentée
    if (segmentedImage) {
      console.log("Segmented image URL:", `${baseURL}/api/get_image/${segmentedImage}`);
    }
  }, [segmentedImage]);

  const downloadImage = async () => {
    if (!segmentedImage) return;

    try {
      const response = await fetch(`${baseURL}/api/get_image/${segmentedImage}`);
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
          {segmentedImage ? (
            <img src={`${baseURL}/api/get_image/${segmentedImage}`} alt="Segmented" className="segmented-image" />
          ) : (
            <p>Aucune image segmentée</p>
          )}

          {/* Bouton "Download" centré sous l'image */}
          {segmentedImage && (
            <button className="download-button" onClick={downloadImage}>
              Download
            </button>
          )}
        </div>
      </div>

      <div className="parameters-download-container">
        <div className="text-container">
          <div className="slider-container">
            <label>Nombre de segments:</label>
            <input
              type="number"
              value={nSegments}
              onChange={(e) => setNSegments(Number(e.target.value))}
              min="10"
              max="500"
            />
          </div>

          <div className="slider-container">
            <label>Compactness:</label>
            <input
              type="number"
              value={compactness}
              onChange={(e) => setCompactness(Number(e.target.value))}
              min="1"
              max="100"
            />
          </div>
        </div>

        <button className="apply-button" onClick={applySegmentation} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

export default ProcessPage;
