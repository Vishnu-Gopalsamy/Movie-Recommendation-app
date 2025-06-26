const axios = require('axios');
const User = require('../models/User');

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'api_key_placeholder';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDB API requests
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`);
    throw new Error('Failed to fetch data from movie database');
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
exports.getPopularMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    
    // For now, use sample data since we don't have a real TMDB API key
    const sampleMovies = [
      {
        id: 1,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
        overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
        release_date: "1994-09-23",
        vote_average: 8.7,
        vote_count: 24558,
        popularity: 97.234,
        genre_ids: [18, 80]
      },
      {
        id: 2,
        title: "The Godfather",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
        release_date: "1972-03-14",
        vote_average: 8.7,
        vote_count: 18212,
        popularity: 87.681,
        genre_ids: [18, 80]
      }
      // Add more sample movies as needed
    ];

    // In production, uncomment the following to use real TMDB API
    // const data = await tmdbRequest('/movie/popular', { page });
    
    // Using sample data for now
    const data = {
      results: sampleMovies,
      page: 1,
      total_pages: 1,
      total_results: sampleMovies.length
    };

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error('Get popular movies error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching popular movies'
    });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
exports.searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Using sample data for now
    const sampleMovies = [
      // Same sample movies from above
    ];
    
    // Filter by query (case insensitive)
    const results = sampleMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    // In production, uncomment the following to use real TMDB API
    // const data = await tmdbRequest('/search/movie', { query, page });
    
    // Using filtered sample data
    const data = {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length
    };

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error('Search movies error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error searching movies'
    });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/details/:id
// @access  Public
exports.getMovieDetails = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    
    // In production, uncomment the following to use real TMDB API
    // const movie = await tmdbRequest(`/movie/${movieId}`);
    // const credits = await tmdbRequest(`/movie/${movieId}/credits`);
    // const recommendations = await tmdbRequest(`/movie/${movieId}/recommendations`);
    // const reviews = await tmdbRequest(`/movie/${movieId}/reviews`);
    
    // For now, send a sample movie
    const movie = {
      id: parseInt(movieId),
      title: "Sample Movie",
      overview: "This is a sample movie description.",
      release_date: "2023-01-01",
      genres: [{ id: 28, name: "Action" }],
      vote_average: 7.5,
      vote_count: 1000,
      runtime: 120,
      poster_path: "/sample_poster.jpg",
      backdrop_path: "/sample_backdrop.jpg"
    };

    res.status(200).json({
      success: true,
      data: movie
      // In production, include credits, recommendations, reviews
    });
  } catch (err) {
    console.error('Get movie details error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching movie details'
    });
  }
};

// @desc    Rate a movie
// @route   POST /api/movies/rate/:id
// @access  Private
exports.rateMovie = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const { rating } = req.body;
    
    // Validate input
    if (!rating || rating < 0.5 || rating > 10) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 0.5 and 10'
      });
    }
    
    // Update user's ratings
    const user = await User.findById(req.user.id);
    
    // If userRatings is null/undefined, initialize it
    if (!user.userRatings) {
      user.userRatings = new Map();
    }
    
    // Set the rating
    user.userRatings.set(movieId.toString(), rating);
    await user.save();
    
    // In production, also send rating to TMDB API
    // await tmdbRequest(`/movie/${movieId}/rating`, { 
    //   value: rating * 2 // TMDB uses 0-10 scale
    // }, 'POST');
    
    res.status(200).json({
      success: true,
      data: {
        movieId,
        rating
      }
    });
  } catch (err) {
    console.error('Rate movie error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error rating movie'
    });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/movies/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // In production, use user's favorites, ratings, and watchlist
    // to get personalized recommendations from TMDB
    
    // For now, return sample recommendations
    const recommendations = [
      {
        id: 100,
        title: "Recommended Movie 1",
        poster_path: "/sample_poster.jpg",
        backdrop_path: "/sample_backdrop.jpg",
        overview: "This is a recommended movie based on your preferences.",
        release_date: "2023-05-15",
        vote_average: 8.1,
        vote_count: 1200,
        popularity: 90.5,
        genre_ids: [28, 12]
      },
      {
        id: 101,
        title: "Recommended Movie 2",
        poster_path: "/sample_poster2.jpg",
        backdrop_path: "/sample_backdrop2.jpg",
        overview: "Another recommended movie tailored to your taste.",
        release_date: "2023-04-20",
        vote_average: 7.8,
        vote_count: 950,
        popularity: 85.2,
        genre_ids: [18, 53]
      }
    ];

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (err) {
    console.error('Get recommendations error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching recommendations'
    });
  }
};