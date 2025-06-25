import React, { useState } from 'react';
import { 
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  FormGroup, FormControlLabel, Switch, TextField, Button, Slider, Chip,
  Alert, Grid, CircularProgress
} from '@mui/material';
import { movieApi } from '../services/movieApi';

// Genre mapping (normally would come from API)
const GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const RecommendationForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    favoriteGenres: [],
    favoriteMovies: '',
    favoriteActors: '',
    releaseYearRange: [1970, new Date().getFullYear()],
    minRating: 7,
    includeAdult: false
  });
  
  const [errors, setErrors] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleGenreChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, favoriteGenres: value });
    // Clear error when field is edited
    if (errors.favoriteGenres) {
      setErrors({ ...errors, favoriteGenres: null });
    }
  };

  const handleYearRangeChange = (event, newValue) => {
    setFormData({ ...formData, releaseYearRange: newValue });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, minRating: newValue });
  };

  const handleAdultChange = (event) => {
    setFormData({ ...formData, includeAdult: event.target.checked });
  };

  const handleMovieSearch = async () => {
    if (!formData.favoriteMovies.trim()) {
      return;
    }
    
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const response = await movieApi.searchMovies(formData.favoriteMovies);
      setSearchResults(response.results || []);
      
      if (response.results?.length === 0) {
        setSearchError('No movies found matching your search.');
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setSearchError(err.message || 'Failed to search movies. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate at least one genre is selected
    if (formData.favoriteGenres.length === 0) {
      newErrors.favoriteGenres = 'Please select at least one genre';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Customize Your Recommendations
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.favoriteGenres}>
              <InputLabel id="favorite-genres-label">Favorite Genres</InputLabel>
              <Select
                labelId="favorite-genres-label"
                id="favorite-genres"
                multiple
                value={formData.favoriteGenres}
                onChange={handleGenreChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={GENRES[value]} />
                    ))}
                  </Box>
                )}
                label="Favorite Genres"
                disabled={loading}
              >
                {Object.entries(GENRES).map(([id, name]) => (
                  <MenuItem key={id} value={parseInt(id)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.favoriteGenres && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.favoriteGenres}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Release Year Range
            </Typography>
            <Slider
              value={formData.releaseYearRange}
              onChange={handleYearRangeChange}
              valueLabelDisplay="auto"
              min={1900}
              max={new Date().getFullYear()}
              disabled={loading}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {formData.releaseYearRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.releaseYearRange[1]}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>
              Minimum Rating: {formData.minRating} / 10
            </Typography>
            <Slider
              value={formData.minRating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              step={0.5}
              min={0}
              max={10}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Movies (Optional)"
              name="favoriteMovies"
              value={formData.favoriteMovies}
              onChange={handleChange}
              placeholder="Enter a movie title"
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={handleMovieSearch}
                    disabled={!formData.favoriteMovies.trim() || searchLoading || loading}
                    sx={{ ml: 1 }}
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </Button>
                ),
              }}
            />
          </Grid>
          
          {searchLoading && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            </Grid>
          )}
          
          {searchError && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setSearchError(null)}>
                {searchError}
              </Alert>
            </Grid>
          )}
          
          {searchResults.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Search Results:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflow: 'auto' }}>
                {searchResults.slice(0, 10).map((movie) => (
                  <Chip 
                    key={movie.id}
                    label={`${movie.title} (${movie.release_date?.substring(0, 4) || 'Unknown'})`}
                    onClick={() => {
                      console.log('Selected movie:', movie);
                      // In a real app, you would add this movie to a selection list
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Favorite Actors/Actresses (Optional)"
              name="favoriteActors"
              value={formData.favoriteActors}
              onChange={handleChange}
              placeholder="e.g. Tom Hanks, Emma Stone"
              variant="outlined"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={formData.includeAdult}
                    onChange={handleAdultChange}
                    name="includeAdult"
                    color="primary"
                    disabled={loading}
                  />
                } 
                label="Include adult content" 
              />
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Get Recommendations'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RecommendationForm;