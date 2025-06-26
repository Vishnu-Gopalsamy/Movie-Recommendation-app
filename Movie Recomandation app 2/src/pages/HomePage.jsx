import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Movie, 
  Star, 
  TrendingUp, 
  Favorite,
  PlayArrow,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import useAuthStore from '../store/authStore';
import MovieGrid from '../components/movies/MovieGrid';

const HomePage = ({ onAuthModalOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { movies, loading, fetchPopularMovies, initializeFromStorage } = useMovieStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    initializeFromStorage();
    fetchPopularMovies();
  }, []);

  const features = [
    {
      icon: <Movie sx={{ fontSize: 40 }} />,
      title: 'Discover Movies',
      description: 'Explore thousands of movies from different genres and eras',
    },
    {
      icon: <Star sx={{ fontSize: 40 }} />,
      title: 'Personalized Recommendations',
      description: 'Get movie suggestions tailored to your taste and preferences',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Trending Content',
      description: 'Stay updated with the latest and most popular movies',
    },
    {
      icon: <Favorite sx={{ fontSize: 40 }} />,
      title: 'Create Your Lists',
      description: 'Build your personal collection of favorites and watchlist',
    },
  ];

  return (
    <Box sx={{ pt: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 'bold', mb: 3 }}
                >
                  Discover Your Next
                  <br />
                  <span style={{ 
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Favorite Movie
                  </span>
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
                >
                  Explore thousands of movies, get personalized recommendations,
                  and build your perfect watchlist. Your cinematic journey starts here.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      to="/discover"
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Start Exploring
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => onAuthModalOpen('register')}
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrow />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                      
                      <Button
                        onClick={() => onAuthModalOpen('login')}
                        variant="outlined"
                        size="large"
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                    },
                  }}
                >
                  <img
                    src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1"
                    alt="Movie Collection"
                    style={{
                      width: '100%',
                      maxWidth: 400,
                      height: 'auto',
                      borderRadius: 20,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 6,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose MovieFlix?
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Movies Section */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <MovieGrid
          movies={movies.slice(0, 8)}
          loading={loading}
          title="Popular Movies"
        />
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/discover"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              },
            }}
          >
            Explore More Movies
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;