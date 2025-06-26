const express = require('express');
const {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  rateMovie,
  getRecommendations
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/details/:id', getMovieDetails);

// Protected routes
router.post('/rate/:id', protect, rateMovie);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;