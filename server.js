const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 9000;

// Endpoint pour envoyer les données des films au site web
app.get('/films', (req, res) => {
  fs.readFile(path.join(__dirname, 'films.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
      return;
    }

    const films = JSON.parse(data);
    res.json(films);
  });
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'build')));

// Servir index.html pour toutes les autres routes
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
