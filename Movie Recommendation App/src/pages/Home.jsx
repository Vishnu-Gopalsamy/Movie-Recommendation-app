import React from 'react';
import { Typography, Box, Container, Button, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Movie Recommender
        </Typography>
        
        <Typography variant="h5" sx={{ mb: 4 }}>
          Discover your next favorite movie
        </Typography>
        
        <Button 
          variant="contained" 
          component={Link} 
          to="/recommendations" 
          size="large" 
          sx={{ mb: 4 }}
        >
          Get Recommendations
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Featured Movies
              </Typography>
              <Typography variant="body1">
                Discover the latest and most popular movies recommended just for you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Personalized Recommendations
              </Typography>
              <Typography variant="body1">
                Get movie suggestions based on your preferences and viewing history.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;