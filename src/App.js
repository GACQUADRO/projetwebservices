import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [films, setFilms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFilm, setNewFilm] = useState({
    nom: '',
    affiche: '',
    acteurs: [],
    date_projection: ''
  });
  const [selectedFilm, setSelectedFilm] = useState('');
  
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewFilm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/ajouterFilm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFilm),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du film');
      }
      const data = await response.json();
      setFilms([...films, data]);
      setNewFilm({
        nom: '',
        affiche: '',
        acteurs: [],
        date_projection: ''
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/supprimerFilm/${selectedFilm}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du film');
      }
      await response.json();
      setFilms(prevFilms => prevFilms.filter(film => film.nom !== selectedFilm));
      setSelectedFilm('');
    } catch (error) {
      console.error(error);
    }
  };
  

  const filteredFilms = films.filter((film) =>
    film.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: filteredFilms.length < 3 ? 'center' : 'flex-start',
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Bienvenue au Cinéma XYZ</h1>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </header>
      <main className="main">
        <section className="movie-section">
          <h2>Films à l'affiche</h2>
          <div className="movies-container" style={containerStyle}>
            {filteredFilms.map((film, index) => (
              <div className="movie" key={index}>
                <img src={film.affiche} alt={`Affiche de ${film.nom}`} width="150" height="225" />
                <div className="movie-details">
                  <h3>{film.nom}</h3>
                  <p>Acteurs: {film.acteurs.join(', ')}</p>
                  <p>Date de projection: {new Date(film.date_projection).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="add-movie-section">
          <h2>Ajouter un nouveau film</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nom:
              <input type="text" name="nom" value={newFilm.nom} onChange={handleInputChange} />
            </label>
            <label>
              Affiche:
              <input type="text" name="affiche" value={newFilm.affiche} onChange={handleInputChange} />
            </label>
            <label>
              Acteurs:
              <input type="text" name="acteurs" value={newFilm.acteurs} onChange={handleInputChange} />
            </label>
            <label>
              Date de projection:
              <input type="datetime-local" name="date_projection" value={newFilm.date_projection} onChange={handleInputChange} />
            </label>
            <button type="submit">Ajouter</button>
          </form>
        </section>
        <br></br>
        <section className="remove-movie-section">
        <div>
            <select value={selectedFilm} onChange={(e) => setSelectedFilm(e.target.value)}>
              <option value="">Sélectionner un film à supprimer</option>
              {filteredFilms.map((film) => (
                <option key={film.id} value={film.id}>{film.nom}</option>
              ))}
            </select>
            <button onClick={handleDelete}>Supprimer</button>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Cinéma XYZ. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
