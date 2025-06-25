import axios from 'axios';
import { handleApiError, isOnline, checkApiConnection } from '../utils/errorHandler';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3', // Replace with your actual API endpoint
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY'}` // Replace with your API key
  }
});

// Add a request interceptor for connectivity checks
api.interceptors.request.use(async (config) => {
  if (!isOnline()) {
    throw new Error('No internet connection. Please check your network and try again.');
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const processedError = handleApiError(error);
    return Promise.reject(processedError);
  }
);

// API methods
export const movieApi = {
  async checkConnection() {
    return await checkApiConnection('https://api.themoviedb.org/3/movie/popular');
  },

  async searchMovies(query, page = 1) {
    try {
      const response = await api.get('/search/movie', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  async getPopularMovies(page = 1) {
    try {
      const response = await api.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  async getMovieDetails(movieId) {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits,videos,reviews,similar'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for movie ${movieId}:`, error);
      throw error;
    }
  },

  async getMovieRecommendations(movieId, page = 1) {
    try {
      const response = await api.get(`/movie/${movieId}/recommendations`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recommendations for movie ${movieId}:`, error);
      throw error;
    }
  },

  async getGenres() {
    try {
      const response = await api.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  async getTrending(timeWindow = 'day', page = 1) {
    try {
      const response = await api.get(`/trending/movie/${timeWindow}`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  async discoverMovies(options = {}, page = 1) {
    try {
      const params = {
        page,
        ...options
      };
      
      const response = await api.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  }
};

export default movieApi;