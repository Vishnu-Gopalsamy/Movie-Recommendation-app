import mongoose from 'mongoose';

const userMovieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['watched', 'watchlist', 'favorite'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  review: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one entry per movie/category
userMovieSchema.index({ userId: 1, movieId: 1, category: 1 }, { unique: true });

const UserMovie = mongoose.model('UserMovie', userMovieSchema);
export default UserMovie;