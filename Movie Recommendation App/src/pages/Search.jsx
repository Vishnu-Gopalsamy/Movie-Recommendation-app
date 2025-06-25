import React, { useState } from 'react';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults] = useState([
    { id: 1, title: 'Movie Result 1', year: 2023, genre: 'Action' },
    { id: 2, title: 'Movie Result 2', year: 2022, genre: 'Drama' },
    { id: 3, title: 'Movie Result 3', year: 2021, genre: 'Comedy' }
  ]);

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Search Movies</h1>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
          />
          <button type="button">Search</button>
        </div>
      </div>

      <div className="filters-section">
        <select defaultValue="all">
          <option value="all">Year</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <select defaultValue="all">
          <option value="all">Genre</option>
          <option value="action">Action</option>
          <option value="drama">Drama</option>
          <option value="comedy">Comedy</option>
        </select>
      </div>

      <div className="search-results">
        {searchResults.map(movie => (
          <div key={movie.id} className="search-result-item">
            <h3>{movie.title}</h3>
            <p>{movie.year} • {movie.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;