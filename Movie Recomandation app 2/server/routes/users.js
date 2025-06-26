const express = require('express');
const {
  updateProfile,
  updatePassword,
  updatePreferences,
  updateNotificationSettings,
  toggleFavorite,
  toggleWatchlist
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below this require authentication
router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/preferences', updatePreferences);
router.put('/notifications', updateNotificationSettings);
router.post('/favorites/:movieId', toggleFavorite);
router.post('/watchlist/:movieId', toggleWatchlist);

module.exports = router;