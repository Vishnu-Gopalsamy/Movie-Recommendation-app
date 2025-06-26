const express = require('express');
const {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  rateMovie,
  getRecommendations
} = require('../controllers/movieController');

const router = express.Router();

router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/details/:id', getMovieDetails);
router.post('/rate/:id', rateMovie);
router.get('/recommendations', getRecommendations);

module.exports = router;