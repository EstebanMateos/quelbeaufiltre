#!/bin/bash

# Arrêter le script en cas d'erreur
set -e

# Étape 1 : Construction de l'application
echo "Running build..."
npm run build

# Étape 2 : Ajouter le fichier CNAME dans le dossier build
echo "Creating CNAME file..."
echo "www.mondomaine.com" > build/CNAME

# Étape 3 : Déployer sur la branche gh-pages
echo "Deploying to gh-pages branch..."
npm run deploy

# Message de confirmation
echo "Deployment successful!"
