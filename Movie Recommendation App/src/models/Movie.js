import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  poster_path: String,
  backdrop_path: String,
  overview: String,
  release_date: Date,
  vote_average: Number,
  genres: [{
    id: Number,
    name: String
  }],
  popularity: Number
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;