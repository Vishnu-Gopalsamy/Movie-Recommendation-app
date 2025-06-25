import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, Box, Alert, Divider, IconButton,
  Tabs, Tab, Chip, Rating
} from '@mui/material';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Simulate loading favorites from local storage or an API
  useEffect(() => {
    const mockFavorites = [
      {
        id: 278,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        vote_average: 8.7,
        genres: [{id: 18, name: "Drama"}],
        release_date: "1994-09-23",
        category: "watched"
      },
      {
        id: 238,
        title: "The Godfather",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        vote_average: 8.7,
        genres: [{id: 18, name: "Drama"}, {id: 80, name: "Crime"}],
        release_date: "1972-03-14",
        category: "watchlist"
      },
      {
        id: 240,
        title: "The Godfather Part II",
        poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
        vote_average: 8.5,
        genres: [{id: 18, name: "Drama"}, {id: 80, name: "Crime"}],
        release_date: "1974-12-20",
        category: "watched"
      },
      {
        id: 424,
        title: "Schindler's List",
        poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
        vote_average: 8.6,
        genres: [{id: 18, name: "Drama"}, {id: 36, name: "History"}],
        release_date: "1993-12-15",
        category: "watchlist"
      }
    ];

    setFavorites(mockFavorites);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRemoveFavorite = (movieId) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };

  // Filter movies based on active tab
  const filteredMovies = activeTab === 0 
    ? favorites 
    : activeTab === 1 
      ? favorites.filter(movie => movie.category === 'watched')
      : favorites.filter(movie => movie.category === 'watchlist');

  return (
    <Container maxWidth="lg" className="favorites-container" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Favorites
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="All" />
          <Tab label="Watched" />
          <Tab label="Watchlist" />
        </Tabs>

        {filteredMovies.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            No movies in this category. Explore our recommendations to add some!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <Card className="favorite-movie-card">
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="360"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <Box 
                      className="favorite-movie-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
                      }}
                    >
                      <Chip 
                        label={movie.category === 'watched' ? 'Watched' : 'Watchlist'} 
                        color={movie.category === 'watched' ? 'success' : 'primary'} 
                        size="small"
                      />
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {movie.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={movie.vote_average / 2} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {movie.vote_average.toFixed(1)}/10
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {movie.release_date.substring(0, 4)} • {movie.genres.map(g => g.name).join(', ')}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/movie/${movie.id}`}
                      variant="contained"
                    >
                      Details
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      variant="outlined"
                      onClick={() => handleRemoveFavorite(movie.id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {favorites.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/recommendations"
            size="large"
          >
            Discover More Movies
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Favorites;