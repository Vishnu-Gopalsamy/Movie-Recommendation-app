import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, Button, Alert, CircularProgress, Snackbar } from '@mui/material';
import { movieApi } from '../services/movieApi';

const MovieRecommendation = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Check API connectivity on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await movieApi.checkConnection();
        setIsConnected(connected);
      } catch (err) {
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };
    
    checkConnection();
  }, []);

  // Load popular movies on initial render if connected
  useEffect(() => {
    if (connectionChecked && isConnected) {
      fetchPopularMovies();
    }
  }, [connectionChecked, isConnected]);

  const fetchPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieApi.getPopularMovies();
      setMovies(data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch popular movies');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await movieApi.searchMovies(searchQuery);
      setMovies(data.results || []);
      if (data.results.length === 0) {
        setError('No movies found matching your search criteria');
      }
    } catch (err) {
      setError(err.message || 'Error fetching movies');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };
  
  const handleRetryConnection = () => {
    setConnectionChecked(false);
    setIsConnected(true);
    const checkConnection = async () => {
      try {
        const connected = await movieApi.checkConnection();
        setIsConnected(connected);
        if (connected) {
          fetchPopularMovies();
        }
      } catch (err) {
        setIsConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };
    
    checkConnection();
  };

  if (!connectionChecked) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Checking API connection...</Typography>
      </Box>
    );
  }

  if (!isConnected) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetryConnection}>
              Retry
            </Button>
          }
        >
          Unable to connect to the movie database. Please check your internet connection and try again.
        </Alert>
        <Typography variant="h4" gutterBottom>
          Movie Recommendations
        </Typography>
        <Typography>
          The app is currently offline. Please check your connection and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Movie Recommendations
      </Typography>
      
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies..."
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Button 
          variant="contained" 
          type="submit" 
          disabled={loading || !searchQuery.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
        {searchQuery.trim() && (
          <Button 
            variant="outlined" 
            sx={{ ml: 2 }} 
            onClick={() => {
              setSearchQuery('');
              fetchPopularMovies();
            }}
            disabled={loading}
          >
            Clear
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {movie.poster_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '100%', height: 'auto' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-movie.jpg';
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {movie.overview ? 
                      (movie.overview.length > 150 ? `${movie.overview.substring(0, 150)}...` : movie.overview)
                      : 'No description available.'
                    }
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Rating: {movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A'}/5
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Release date: {movie.release_date || 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>      )}

      {!loading && movies.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No movies found. Try a different search term.
          </Typography>
        </Box>
      )}

      <Snackbar 
        open={isConnected === false}
        autoHideDuration={6000}
        message="Network connection lost"
        action={
          <Button color="secondary" size="small" onClick={handleRetryConnection}>
            Retry
          </Button>
        }
      />
    </Box>
  );
};

export default MovieRecommendation;