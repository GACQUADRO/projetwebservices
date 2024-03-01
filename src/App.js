import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await fetch('/films');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      setFilms(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Bienvenue au Cinéma XYZ</h1>
        <input type="text" placeholder="Rechercher un film..." />
      </header>
      <main className="main">
        <section className="movie-section">
          <h2>Films à l'affiche</h2>
          {films.map((film, index) => (
            <div className="movie" key={index}>
              <img src={film.affiche} alt={`Affiche de ${film.nom}`} width="150" height="225" />
              <div className="movie-details">
                <h3>{film.nom}</h3>
                <p>Acteurs: {film.acteurs.join(', ')}</p>
                <p>Date de projection: {new Date(film.date_projection).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Cinéma XYZ. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
