import UserMovie from '../models/UserMovie.js';

export async function getUserFavorites(userId) {
  try {
    const favorites = await UserMovie.find({ 
      userId, 
      category: 'favorite' 
    }).sort({ addedAt: -1 });
    
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

export async function addFavorite(userId, movieData) {
  try {
    const newFavorite = new UserMovie({
      userId,
      movieId: movieData.id,
      category: 'favorite'
    });
    
    await newFavorite.save();
    return newFavorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(userId, movieId) {
  try {
    const result = await UserMovie.findOneAndDelete({
      userId,
      movieId,
      category: 'favorite'
    });
    
    return result;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export async function isFavorite(userId, movieId) {
  try {
    const favorite = await UserMovie.findOne({
      userId,
      movieId,
      category: 'favorite'
    });
    
    return !!favorite;
  } catch (error) {
    console.error('Error checking if favorite:', error);
    throw error;
  }
}