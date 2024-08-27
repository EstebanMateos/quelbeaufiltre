import React, { useEffect } from 'react';
import axios from 'axios';
import '../css/ProcessPage.css';

const ProcessPage = ({
  file,
  nSegments,
  setNSegments,
  compactness,
  setCompactness,
  segmentedImage,
  setSegmentedImage,
}) => {
  useEffect(() => {
    if (file) {
      applySegmentation();
    }
  }, [nSegments, compactness, file]);

  const applySegmentation = async () => {
    if (!file) return;

    try {
      const response = await axios.post('https://imagestyle.onrender.com/api/segment', {
        image_path: `uploads/${file.name}`,
        n_segments: nSegments,
        compactness: compactness,
      });

      if (response.data && response.data.path) {
        setSegmentedImage(response.data.path);
      } else {
        console.error('No path found in response:', response.data);
      }
    } catch (error) {
      console.error('Error segmenting image:', error);
    }
  };

  const downloadImage = async () => {
    if (!segmentedImage) return;

    try {
      const response = await axios.get(`https://imagestyle.onrender.com/api/get_image/${segmentedImage}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
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

  const incrementValue = (setter, step = 1) => () => setter((prev) => Math.min(prev + step, 500));
  const decrementValue = (setter, step = 1) => () => setter((prev) => Math.max(prev - step, 1));

  return (
    <div className="process-page p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Image Segmenter</h1>

      {/* Parameters section */}
      <div className="parameters">
        <div className="parameter-control">
          <label className="font-bold mb-2">
            Number of Segments:
          </label>
          <div className="flex items-center justify-center">
            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l" onClick={decrementValue(setNSegments)}>-</button>
            <input
              type="number"
              value={nSegments}
              onChange={(e) => setNSegments(Number(e.target.value))}
              min="10"
              max="500"
              className="w-16 text-center border-t border-b border-gray-300"
            />
            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r" onClick={incrementValue(setNSegments)}>+</button>
          </div>
        </div>

        <div className="parameter-control">
          <label className="font-bold mb-2">
            Compactness:
          </label>
          <div className="flex items-center justify-center">
            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l" onClick={decrementValue(setCompactness)}>-</button>
            <input
              type="number"
              value={compactness}
              onChange={(e) => setCompactness(Number(e.target.value))}
              min="1"
              max="100"
              className="w-16 text-center border-t border-b border-gray-300"
            />
            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r" onClick={incrementValue(setCompactness)}>+</button>
          </div>
        </div>
      </div>

      {/* Images section */}
      <div className="images-container">
        {file && (
          <div className="image-wrapper">
            <h2 className="text-lg font-semibold mb-2">Original Image</h2>
            <img
              src={URL.createObjectURL(file)}
              alt="Original"
            />
          </div>
        )}

        {segmentedImage && (
          <div className="image-wrapper">
            <h2 className="text-lg font-semibold mb-2">Segmented Image</h2>
            <img
              src={`https://imagestyle.onrender.com/api/get_image/${segmentedImage}`}
              alt="Segmented"
            />
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={downloadImage}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessPage;
