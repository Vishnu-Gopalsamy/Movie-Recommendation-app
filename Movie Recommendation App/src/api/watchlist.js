import UserMovie from '../models/UserMovie.js';

export async function getWatchlist(userId) {
  try {
    const watchlist = await UserMovie.find({ 
      userId, 
      category: 'watchlist' 
    }).sort({ addedAt: -1 });
    
    return watchlist;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    throw error;
  }
}

export async function addToWatchlist(userId, movieData) {
  try {
    const newWatchlistItem = new UserMovie({
      userId,
      movieId: movieData.id,
      category: 'watchlist'
    });
    
    await newWatchlistItem.save();
    return newWatchlistItem;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
}

export async function removeFromWatchlist(userId, movieId) {
  try {
    const result = await UserMovie.findOneAndDelete({
      userId,
      movieId,
      category: 'watchlist'
    });
    
    return result;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
}

export async function isInWatchlist(userId, movieId) {
  try {
    const watchlistItem = await UserMovie.findOne({
      userId,
      movieId,
      category: 'watchlist'
    });
    
    return !!watchlistItem;
  } catch (error) {
    console.error('Error checking if in watchlist:', error);
    throw error;
  }
}