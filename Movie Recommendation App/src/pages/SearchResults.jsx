import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, Box, Typography, Grid, FormControl, InputLabel,
  Select, MenuItem, TextField, Button, Paper, Pagination,
  CircularProgress, Alert, Chip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MovieList from '../components/MovieList';
import { movieApi } from '../services/movieApi';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: 'all',
    year: 'all',
    sort: 'popularity.desc'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Simulated search function
  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Update URL with search query without page reload
      const url = new URL(window.location);
      url.searchParams.set('query', searchQuery);
      window.history.pushState({}, '', url);
      
      // In a real app, we would include filters in the API call
      const response = await movieApi.searchMovies(searchQuery, page);
      
      setSearchResults(response.results || []);
      setTotalPages(Math.min(response.total_pages || 1, 500)); // TMDB API limits to 500 pages
      
      if (response.results?.length === 0) {
        setError('No movies found matching your search criteria.');
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setError(err.message || 'Failed to search movies. Please try again later.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform search when query changes
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery, page]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Reset to page 1 when filters change
    setPage(1);
    
    // In a real app, we would re-fetch results with new filters
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Genre mapping for display
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10749: 'Romance',
    878: 'Sci-Fi'
  };
  
  // Function to enhance movie objects with genre names
  const enhanceMoviesWithGenreNames = (movies) => {
    return movies.map(movie => ({
      ...movie,
      genreNames: movie.genre_ids?.map(id => genreMap[id] || 'Unknown') || []
    }));
  };
  
  // Enhanced movies with genre names
  const enhancedMovies = enhanceMoviesWithGenreNames(searchResults);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            fullWidth
            variant="outlined"
            size="medium"
          />
          <Button 
            type="submit"
            variant="contained" 
            startIcon={<SearchIcon />}
            disabled={!searchQuery.trim() || loading}
            sx={{ whitespace: 'nowrap', px: 3 }}
          >
            Search
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filters sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Filter Results
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="genre-select-label">Genre</InputLabel>
              <Select
                labelId="genre-select-label"
                id="genre-select"
                value={filters.genre}
                name="genre"
                label="Genre"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Genres</MenuItem>
                {Object.entries(genreMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="year-select-label">Release Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={filters.year}
                name="year"
                label="Release Year"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Years</MenuItem>
                {[...Array(30)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <MenuItem key={year} value={year}>{year}</MenuItem>;
                })}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={filters.sort}
                name="sort"
                label="Sort By"
                onChange={handleFilterChange}
              >
                <MenuItem value="popularity.desc">Popularity (Desc)</MenuItem>
                <MenuItem value="popularity.asc">Popularity (Asc)</MenuItem>
                <MenuItem value="vote_average.desc">Rating (Desc)</MenuItem>
                <MenuItem value="vote_average.asc">Rating (Asc)</MenuItem>
                <MenuItem value="release_date.desc">Release Date (Desc)</MenuItem>
                <MenuItem value="release_date.asc">Release Date (Asc)</MenuItem>
                <MenuItem value="title.asc">Title (A-Z)</MenuItem>
                <MenuItem value="title.desc">Title (Z-A)</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 3 }}
              onClick={() => {
                setFilters({
                  genre: 'all',
                  year: 'all',
                  sort: 'popularity.desc'
                });
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Search results */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : searchResults.length > 0 ? (
            <>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Found {searchResults.length} results for "{initialQuery}"
                </Typography>
                
                {Object.entries(filters).map(([key, value]) => {
                  if (value !== 'all') {
                    let label = '';
                    if (key === 'genre') {
                      label = `Genre: ${genreMap[value] || value}`;
                    } else if (key === 'year') {
                      label = `Year: ${value}`;
                    } else if (key === 'sort') {
                      const sortMap = {
                        'popularity.desc': 'Most Popular',
                        'popularity.asc': 'Least Popular',
                        'vote_average.desc': 'Highest Rated',
                        'vote_average.asc': 'Lowest Rated',
                        'release_date.desc': 'Newest',
                        'release_date.asc': 'Oldest',
                        'title.asc': 'A-Z',
                        'title.desc': 'Z-A',
                      };
                      label = `Sorted by: ${sortMap[value]}`;
                    }
                    
                    if (label) {
                      return (
                        <Chip 
                          key={key} 
                          label={label} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                      );
                    }
                  }
                  return null;
                })}
              </Box>
              
              <MovieList 
                movies={enhancedMovies} 
                loading={loading}
                error={error}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="text.secondary">
                Enter a search term to find movies.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResults;