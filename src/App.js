import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/styles.css';
import ProcessPage from './components/ProcessPage';

function App() {
  const [file, setFile] = useState(null); // Fichier image sélectionné
  const [nSegments, setNSegments] = useState(60); // Nombre de segments
  const [compactness, setCompactness] = useState(5); // Compactness
  const [segmentedImage, setSegmentedImage] = useState(null); // Image segmentée
  const [isProcessing, setIsProcessing] = useState(false); // État de traitement en cours
  const [isMobile, setIsMobile] = useState(false); // Gestion de l'affichage mobile

  // Fonction pour gérer le changement de fichier
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSegmentedImage(null); // Réinitialise l'image segmentée lors du changement de fichier
      applySegmentation();
    }
  };

  // Fonction pour segmenter l'image
  const applySegmentation = async () => {
    if (!file) return;
    setIsProcessing(true); // Désactiver le bouton "Appliquer" pendant le traitement

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Envoi de l'image au serveur pour traitement
      await axios.post('https://imagestyle.onrender.com/api/upload', formData);

      const response = await axios.post('https://imagestyle.onrender.com/api/segment', {
        image_path: `uploads/${file.name}`,
        n_segments: nSegments,
        compactness: compactness,
      });

      // Mise à jour de l'image segmentée après le traitement
      setSegmentedImage(response.data.path);
    } catch (error) {
      console.error("Erreur lors du traitement de l'image :", error);
    } finally {
      setIsProcessing(false); // Réactiver le bouton une fois le processus terminé
    }
  };

  // Utilisation de useEffect pour détecter si l'utilisateur est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkMobile(); // Appel initial
    window.addEventListener('resize', checkMobile); // Ajoute un listener sur le redimensionnement

    return () => {
      window.removeEventListener('resize', checkMobile); // Nettoyage du listener
    };
  }, []);

  return (
    <div className="app-container">
      {/* Titre avec gestion mobile */}
      <h1 className="project-title">
        {isMobile ? "Le filtre magique" : "Le filtre le plus incroyable de l'univers"}
      </h1>

      {!file ? (
        // Affichage de la zone d'upload tant qu'aucune image n'est sélectionnée
        <div className="upload-section">
          <label className="upload-button">
            Select an Image
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <p className="explanation-text">Envoie ton image au serveur pour la vectoriser.</p>
        </div>
      ) : (
        // Affichage de la page de traitement lorsque l'image est sélectionnée
        <ProcessPage
          file={file}
          nSegments={nSegments}
          setNSegments={setNSegments}
          compactness={compactness}
          setCompactness={setCompactness}
          segmentedImage={segmentedImage}
          applySegmentation={applySegmentation}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

export default App;
