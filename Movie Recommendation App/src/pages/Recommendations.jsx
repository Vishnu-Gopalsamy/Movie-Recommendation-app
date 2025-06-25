import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab, Paper, CircularProgress, Alert } from '@mui/material';
import { movieApi } from '../services/movieApi';
import MovieList from '../components/MovieList';
import RecommendationForm from '../components/RecommendationForm';

const Recommendations = ({ favorites = [], onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch initial recommendations on component mount
  useEffect(() => {
    if (activeTab === 0 && !formSubmitted) {
      fetchPopularMovies();
    }
  }, [activeTab]);

  const fetchPopularMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await movieApi.getPopularMovies();
      setRecommendations(data.results || []);
    } catch (err) {
      setError('Failed to fetch popular movies. Please try again later.');
      console.error('Error fetching popular movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setFormSubmitted(true);
    
    try {
      // In a real app, we would send the form data to an API endpoint
      // that would return personalized recommendations based on the user's preferences
      // For now, we'll simulate this by fetching popular movies and filtering them
      
      const data = await movieApi.getPopularMovies();
      let filteredMovies = data.results || [];
      
      // Filter by genre if genres are selected
      if (formData.favoriteGenres.length > 0) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.genre_ids && movie.genre_ids.some(id => formData.favoriteGenres.includes(id))
        );
      }
      
      // Filter by minimum rating
      if (formData.minRating > 0) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.vote_average >= formData.minRating
        );
      }
      
      // Filter by release year range
      filteredMovies = filteredMovies.filter(movie => {
        if (!movie.release_date) return false;
        const year = new Date(movie.release_date).getFullYear();
        return year >= formData.releaseYearRange[0] && year <= formData.releaseYearRange[1];
      });
      
      // Sort by match score (in a real app, this would be calculated based on user preferences)
      filteredMovies = filteredMovies.map(movie => ({
        ...movie,
        match_score: Math.floor(Math.random() * 30) + 70 // Random score between 70-99
      })).sort((a, b) => b.match_score - a.match_score);
      
      setRecommendations(filteredMovies);
      
      // Switch to the recommendations tab
      setActiveTab(0);
    } catch (err) {
      setError('Failed to generate recommendations. Please try again later.');
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Movie Recommendations
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="Recommendations" />
          <Tab label="Customize" />
        </Tabs>
      </Paper>
      
      {activeTab === 0 && (
        <Box>
          {formSubmitted ? (
            <Typography variant="h5" gutterBottom>
              Your Personalized Recommendations
            </Typography>
          ) : (
            <Typography variant="h5" gutterBottom>
              Popular Movies You Might Like
            </Typography>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MovieList 
              movies={recommendations}
              loading={loading}
              error={error}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              emptyMessage="No recommendations found. Try adjusting your preferences."
            />
          )}
          
          {!loading && recommendations.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No recommendations found. Try adjusting your preferences.
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Customize Your Recommendations
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Tell us what you like, and we'll recommend movies tailored to your taste.
          </Typography>
          
          <RecommendationForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </Box>
      )}
    </Container>
  );
};

export default Recommendations;