const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 9000;

app.use(express.json());

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

app.post('/ajouterFilm', (req, res) => {
  const newFilm = req.body;

  // Assurez-vous que acteurs est un tableau
  if (!Array.isArray(newFilm.acteurs)) {
    newFilm.acteurs = [newFilm.acteurs];
  }
  
  fs.readFile(path.join(__dirname, 'films.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
      return;
    }

    const films = JSON.parse(data);
    films.push(newFilm);

    fs.writeFile(path.join(__dirname, 'films.json'), JSON.stringify(films, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier JSON :', err);
        res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier JSON' });
        return;
      }
      res.json(newFilm);
    });
  });
});

app.delete('/supprimerFilm/:nom', (req, res) => {
  const filmToDeleteNom = req.params.nom;

  fs.readFile(path.join(__dirname, 'films.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
      return;
    }

    let films = JSON.parse(data);
    const updatedFilms = films.filter(film => film.nom !== filmToDeleteNom);

    fs.writeFile(path.join(__dirname, 'films.json'), JSON.stringify(updatedFilms, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier JSON :', err);
        res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier JSON' });
        return;
      }
      res.json({ message: 'Film supprimé avec succès' });
    });
  });
});



app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
