import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, CircularProgress, Pagination, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import MovieCard from './MovieCard';

const MovieList = ({ 
  movies, 
  loading, 
  error, 
  title, 
  favorites = [], 
  onToggleFavorite,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  emptyMessage = "No movies found"
}) => {
  const [sortBy, setSortBy] = useState('popularity');
  const [sortedMovies, setSortedMovies] = useState([]);

  useEffect(() => {
    if (!movies || movies.length === 0) {
      setSortedMovies([]);
      return;
    }

    const sortMovies = () => {
      const moviesCopy = [...movies];
      
      switch (sortBy) {
        case 'title':
          return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
        case 'rating':
          return moviesCopy.sort((a, b) => b.vote_average - a.vote_average);
        case 'release_date':
          return moviesCopy.sort((a, b) => {
            if (!a.release_date) return 1;
            if (!b.release_date) return -1;
            return new Date(b.release_date) - new Date(a.release_date);
          });
        case 'popularity':
        default:
          return moviesCopy.sort((a, b) => b.popularity - a.popularity);
      }
    };

    setSortedMovies(sortMovies());
  }, [movies, sortBy]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!sortedMovies || sortedMovies.length === 0) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="popularity">Popularity</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="release_date">Release Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {sortedMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard 
              movie={movie} 
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={(e, page) => onPageChange && onPageChange(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default MovieList;