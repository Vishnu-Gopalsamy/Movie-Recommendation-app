import UserMovie from '../models/UserMovie.js';

export async function getUserRatings(userId) {
  try {
    const ratings = await UserMovie.find({ 
      userId,
      rating: { $exists: true, $ne: null }
    }).sort({ addedAt: -1 });
    
    return ratings;
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    throw error;
  }
}

export async function getMovieRating(userId, movieId) {
  try {
    const rating = await UserMovie.findOne({
      userId,
      movieId,
      rating: { $exists: true, $ne: null }
    });
    
    return rating;
  } catch (error) {
    console.error('Error fetching movie rating:', error);
    throw error;
  }
}

export async function addOrUpdateRating(userId, movieId, ratingData) {
  try {
    const { rating, review } = ratingData;
    
    // Try to find existing rating
    const existingRating = await UserMovie.findOne({
      userId,
      movieId,
      category: 'watched'
    });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      if (review) {
        existingRating.review = review;
      }
      await existingRating.save();
      return existingRating;
    } else {
      // Create new rating
      const newRating = new UserMovie({
        userId,
        movieId,
        category: 'watched',
        rating,
        review: review || ''
      });
      
      await newRating.save();
      return newRating;
    }
  } catch (error) {
    console.error('Error adding/updating rating:', error);
    throw error;
  }
}

export async function deleteRating(userId, movieId) {
  try {
    const result = await UserMovie.findOneAndUpdate(
      {
        userId,
        movieId,
        category: 'watched'
      },
      {
        $unset: { rating: "", review: "" }
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
}