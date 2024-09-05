import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/styles.css';
import ProcessPage from './components/ProcessPage';

const baseURL = "https://imagestyle.onrender.com";

function App() {
  const [file, setFile] = useState(null); // Fichier image sélectionné
  const [nSegments, setNSegments] = useState(60); // Nombre de segments
  const [compactness, setCompactness] = useState(5); // Compactness
  const [segmentedImage, setSegmentedImage] = useState(null); // Image segmentée
  const [isProcessing, setIsProcessing] = useState(false); // État de traitement en cours

  // Fonction exécutée lors de la sélection d'un fichier
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSegmentedImage(null); // Réinitialise l'image segmentée lors du changement de fichier
      await uploadAndSegment(selectedFile, nSegments, compactness); // Segmente automatiquement après l'upload
    }
  };

  // Fonction pour upload et segmenter l'image avec les paramètres actuels
  const uploadAndSegment = async (selectedFile, nSegments, compactness) => {
    if (!selectedFile) return;

    setIsProcessing(true); // Désactiver le bouton pendant le traitement

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Upload de l'image
      const uploadResponse = await axios.post(`${baseURL}/api/upload`, formData);

      // Segmentation immédiate après l'upload
      const segmentResponse = await axios.post(`${baseURL}/api/segment`, {
        image_path: uploadResponse.data.path,
        n_segments: nSegments,
        compactness: compactness,
      });

      // Mise à jour de l'image segmentée après le traitement
      setSegmentedImage(segmentResponse.data.path);
    } catch (error) {
      console.error('Erreur lors de l\'upload ou du traitement de l\'image :', error);
    } finally {
      setIsProcessing(false); // Réactiver le bouton une fois le processus terminé
    }
  };

  // Fonction pour appliquer la segmentation à partir des paramètres actuels
  const applySegmentation = async () => {
    if (!file) return;

    setIsProcessing(true); // Désactiver le bouton pendant le traitement

    try {
      // Segmentation de l'image avec les nouveaux paramètres
      const response = await axios.post(`${baseURL}/api/segment`, {
        image_path: `uploads/${file.name}`, // Assurez-vous que l'URL du fichier est correcte
        n_segments: nSegments,
        compactness: compactness,
      });

      // Mise à jour de l'image segmentée après le traitement
      console.log(response.data.path);
      setSegmentedImage(response.data.path);
    } catch (error) {
      console.error('Erreur lors de la segmentation :', error);
    } finally {
      setIsProcessing(false); // Réactiver le bouton une fois le processus terminé
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${baseURL}/api/initial`);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation :', error);
      }
    };

    // Exécuter la requête au chargement de la page
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <h1 className="project-title">Le filtre le plus incroyable de l'univers</h1>

      {!file ? (
        <div className="upload-section">
          <p>Bienvenue sur mon site !</p>
          <p>
            Une fois une image envoyée, tu pourras modifier deux paramètres pour obtenir une image vectorisée un peu stylée. 
            Les deux paramètres sont :
          </p>
          <p>
            <strong>Compactness :</strong> Ce paramètre contrôle à quel point les morceaux découpés sont bien groupés. Un nombre élevé fait que les morceaux sont plus compacts et proches, tandis qu'un nombre plus bas permet de privilégier la similitude des couleurs des pixels dans la création des morceaux. Je conseille de garder une petite valeur.
          </p>
          <p>
            <strong>Nombre de segments :</strong> C'est le nombre de parties ou "blocs" que l'on veut obtenir en divisant l'image. Plus ce nombre est élevé, plus l'image sera découpée en petits morceaux.
          </p>
          <label className="upload-button">
            Choisis une image à segmenter.
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <p className="explanation-text">
            Envoie ton image au serveur pour la vectoriser. Par PITIÉ, utilise d'abord un site du genre remove.bg pour supprimer le fond de l'image, sinon ça risque de pas marcher. (C'est pas fou sur téléphone pour l'instant)
          </p>
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
