import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    genre_ids,
    overview
  } = movie;

  // Convert vote average to a 5-star scale
  const ratingValue = vote_average ? vote_average / 2 : 0;

  // Format release date
  const formattedDate = release_date 
    ? new Date(release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={poster_path 
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : '/placeholder-movie.jpg'
          }
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
          onClick={() => onToggleFavorite && onToggleFavorite(movie)}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to={`/movie/${id}`}
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating 
            value={ratingValue} 
            precision={0.5} 
            readOnly 
            size="small" 
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {ratingValue.toFixed(1)}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {formattedDate}
        </Typography>
        
        {genre_ids && genre_ids.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {genre_ids.slice(0, 3).map((genreId) => (
              <Chip 
                key={genreId} 
                label={genreId} 
                size="small" 
                variant="outlined" 
              />
            ))}
          </Box>
        )}
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 'auto', pt: 1 }}
        >
          {overview 
            ? overview.length > 120 
              ? `${overview.substring(0, 120)}...` 
              : overview
            : 'No description available.'
          }
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;