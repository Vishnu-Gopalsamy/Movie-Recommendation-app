import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, Container, Grid, Typography, Rating, Chip, Button, 
  Card, CardMedia, Divider, Paper, CircularProgress, Alert,
  Tabs, Tab 
} from '@mui/material';
import { 
  Favorite, FavoriteBorder, BookmarkBorder, Bookmark,
  Star, AccessTime, CalendarToday 
} from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieList from '../components/MovieList';
import { movieApi } from '../services/movieApi';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, make API calls to fetch the movie details
        // For this example, we'll use mock data
        setTimeout(() => {
          const mockMovie = {
            id: parseInt(id),
            title: `Movie Title ${id}`,
            poster_path: '/example-poster.jpg',
            backdrop_path: '/example-backdrop.jpg',
            overview: 'This is a detailed overview of the movie. It discusses the plot, characters, and themes without giving away too many spoilers.',
            release_date: '2023-05-15',
            vote_average: 7.8,
            vote_count: 1250,
            runtime: 128,
            genres: [
              { id: 28, name: 'Action' },
              { id: 12, name: 'Adventure' },
              { id: 878, name: 'Science Fiction' }
            ],
            spoken_languages: [
              { english_name: 'English' },
              { english_name: 'Spanish' }
            ],
            production_companies: [
              { name: 'Universal Pictures', logo_path: '/universal.png' },
              { name: 'Amblin Entertainment', logo_path: '/amblin.png' }
            ],
            credits: {
              cast: [
                { id: 1, name: 'Actor 1', character: 'Character 1', profile_path: '/actor1.jpg' },
                { id: 2, name: 'Actor 2', character: 'Character 2', profile_path: '/actor2.jpg' },
                { id: 3, name: 'Actor 3', character: 'Character 3', profile_path: '/actor3.jpg' }
              ],
              crew: [
                { id: 101, name: 'Director Name', job: 'Director', profile_path: '/director.jpg' },
                { id: 102, name: 'Writer Name', job: 'Screenplay', profile_path: '/writer.jpg' }
              ]
            },
            videos: {
              results: [
                { id: 'video1', key: 'dQw4w9WgXcQ', name: 'Official Trailer', type: 'Trailer' }
              ]
            },
            reviews: {
              results: [
                { 
                  id: 'r1', 
                  author: 'Reviewer 1', 
                  content: 'This movie was incredible! The special effects were top-notch and the story kept me engaged throughout.', 
                  created_at: '2023-06-10' 
                },
                { 
                  id: 'r2', 
                  author: 'Reviewer 2', 
                  content: 'A bit overrated in my opinion, but still entertaining with some great performances.', 
                  created_at: '2023-06-15' 
                }
              ]
            }
          };
          
          const mockSimilarMovies = [
            {
              id: 501,
              title: 'Similar Movie 1',
              poster_path: '/similar1.jpg',
              vote_average: 7.5,
              release_date: '2022-11-03',
              genre_ids: [28, 12],
              overview: 'This is a similar movie you might enjoy.'
            },
            {
              id: 502,
              title: 'Similar Movie 2',
              poster_path: '/similar2.jpg',
              vote_average: 8.1,
              release_date: '2023-01-20',
              genre_ids: [28, 878],
              overview: 'Another similar movie recommendation.'
            },
            {
              id: 503,
              title: 'Similar Movie 3',
              poster_path: '/similar3.jpg',
              vote_average: 6.9,
              release_date: '2022-08-12',
              genre_ids: [12, 878],
              overview: 'You might also like this film based on your interests.'
            }
          ];
          
          setMovie(mockMovie);
          setSimilarMovies(mockSimilarMovies);
          
          // Check if movie is in favorites and watchlist
          const savedFavorites = localStorage.getItem('movieFavorites');
          if (savedFavorites) {
            try {
              const favorites = JSON.parse(savedFavorites);
              setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
            } catch (e) {
              console.error('Error parsing favorites:', e);
            }
          }
          
          const savedWatchlist = localStorage.getItem('movieWatchlist');
          if (savedWatchlist) {
            try {
              const watchlist = JSON.parse(savedWatchlist);
              setIsInWatchlist(watchlist.some(item => item.id === parseInt(id)));
            } catch (e) {
              console.error('Error parsing watchlist:', e);
            }
          }
          
          setLoading(false);
        }, 1000); // Simulate API loading delay
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // Update localStorage
    const savedFavorites = localStorage.getItem('movieFavorites');
    let favorites = [];
    
    try {
      favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
      console.error('Error parsing favorites:', e);
    }
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
      // Add to favorites
      favorites.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genre_ids: movie.genres.map(g => g.id)
      });
    }
    
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  };
  
  const handleToggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    
    // Update localStorage
    const savedWatchlist = localStorage.getItem('movieWatchlist');
    let watchlist = [];
    
    try {
      watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (e) {
      console.error('Error parsing watchlist:', e);
    }
    
    if (isInWatchlist) {
      // Remove from watchlist
      watchlist = watchlist.filter(item => item.id !== movie.id);
    } else {
      // Add to watchlist
      watchlist.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genre_ids: movie.genres.map(g => g.id)
      });
    }
    
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    // In a real app, you would send this rating to your backend
    console.log(`User rated ${movie.title} as ${newValue} stars`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 3 }}>
          Movie not found.
        </Alert>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

  const director = movie.credits.crew.find(person => person.job === 'Director');
  const writers = movie.credits.crew.filter(person => 
    person.job === 'Screenplay' || person.job === 'Writer');
  
  // Format runtime to hours and minutes
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const formattedRuntime = `${hours}h ${minutes}m`;
  
  return (
    <Box>
      {/* Movie backdrop and header info */}
      <Box 
        sx={{ 
          position: 'relative',
          height: { xs: 300, sm: 400, md: 500 },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 4
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Grid 
            container 
            sx={{ 
              height: '100%', 
              alignItems: 'flex-end',
              pb: 3
            }}
          >
            <Grid item xs={12} sm={4} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  top: { sm: 40, md: 60 },
                  '& img': {
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-movie.jpg';
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={8} md={9}>
              <Box sx={{ pl: { sm: 4 } }}>
                <Typography variant="h4" component="h1" color="white" gutterBottom>
                  {movie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={movie.vote_average / 2} 
                    precision={0.5} 
                    readOnly 
                  />
                  <Typography variant="body1" color="white" sx={{ ml: 1 }}>
                    {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {movie.genres.map((genre) => (
                    <Chip 
                      key={genre.id}
                      label={genre.name}
                      sx={{ 
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)'
                      }}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {formattedRuntime}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained"
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleToggleFavorite}
                    color={isFavorite ? "error" : "primary"}
                  >
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    startIcon={isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
                    onClick={handleToggleWatchlist}
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Mobile poster view */}
          <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center' }}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ maxWidth: '80%', borderRadius: 8 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-movie.jpg';
              }}
            />
          </Grid>
          
          {/* Main content area */}
          <Grid item xs={12} sm={8} md={9}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {director && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Director
                    </Typography>
                    <Typography variant="body1">
                      {director.name}
                    </Typography>
                  </Grid>
                )}
                
                {writers.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Writer{writers.length > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="body1">
                      {writers.map(writer => writer.name).join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Paper sx={{ mb: 4 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Cast" />
                <Tab label="Reviews" />
                <Tab label="Videos" />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    {movie.credits.cast.map((person) => (
                      <Grid item xs={6} sm={4} md={3} key={person.id}>
                        <Card sx={{ height: '100%' }}>
                          <CardMedia
                            component="img"
                            height={180}
                            image={person.profile_path 
                              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                              : '/placeholder-actor.jpg'
                            }
                            alt={person.name}
                          />
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {person.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {person.character}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                {activeTab === 1 && (
                  <Box>
                    {movie.reviews.results.length > 0 ? (
                      <>
                        {movie.reviews.results.map((review) => (
                          <Box key={review.id} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {review.author}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(review.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body1">
                              {review.content}
                            </Typography>
                            <Divider sx={{ mt: 2 }} />
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No reviews available for this movie.
                      </Typography>
                    )}
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box>
                    {movie.videos.results.length > 0 ? (
                      <Grid container spacing={2}>
                        {movie.videos.results.map((video) => (
                          <Grid item xs={12} md={6} key={video.id}>
                            <Box sx={{ position: 'relative', pb: '56.25%', height: 0, mb: 2 }}>
                              <iframe
                                src={`https://www.youtube.com/embed/${video.key}`}
                                title={video.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '8px'
                                }}
                              />
                            </Box>
                            <Typography variant="subtitle2">
                              {video.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No videos available for this movie.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Your Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating 
                  name="user-rating"
                  value={userRating}
                  onChange={handleRatingChange}
                  size="large"
                  precision={0.5}
                  emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {userRating ? `${userRating}/5` : 'Rate this movie'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Similar Movies
              </Typography>
              <MovieList 
                movies={similarMovies}
                loading={false}
                error={null}
              />
            </Box>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} sm={4} md={3}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Movie Info
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  Released
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Original Language
                </Typography>
                <Typography variant="body1">
                  {movie.spoken_languages[0]?.english_name || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Production Companies
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {movie.production_companies.map((company) => (
                    <Typography key={company.name} variant="body2" paragraph>
                      {company.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Share
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="small" fullWidth>
                  Facebook
                </Button>
                <Button variant="contained" size="small" fullWidth>
                  Twitter
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;