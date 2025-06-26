import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Genre mapping for display in UI
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const useMovieStore = create(
  persist(
    (set, get) => ({
      // State
      movies: [],
      searchResults: [],
      searchQuery: '',
      favorites: [],
      watchlist: [],
      userRatings: {},
      currentMovie: null,
      loading: false,
      error: null,
      genres: [],
      
      // Actions
      fetchPopularMovies: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/movies/popular');
          set({ movies: response.data.results, loading: false });
        } catch (error) {
          console.error('Error fetching popular movies:', error);
          set({ 
            loading: false, 
            error: error.response?.data?.error || 'Failed to fetch popular movies.' 
          });
        }
      },
      
      searchMovies: async (query) => {
        if (!query.trim()) return;
        
        try {
          set({ loading: true, error: null, searchQuery: query });
          const response = await api.get('/movies/search', {
            params: { query }
          });
          set({ searchResults: response.data.results, loading: false });
        } catch (error) {
          console.error('Error searching movies:', error);
          set({ 
            loading: false, 
            error: error.response?.data?.error || 'Failed to search movies.' 
          });
        }
      },
      
      fetchMovieDetails: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/movies/details/${id}`);
          if (response.data.success) {
            set({ currentMovie: response.data.data, loading: false });
          } else {
            set({ 
              loading: false, 
              error: 'Movie not found. It may have been removed or the ID is invalid.' 
            });
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
          set({ 
            loading: false, 
            error: error.response?.data?.error || 'Failed to fetch movie details.' 
          });
        }
      },
      
      toggleFavorite: async (movie) => {
        try {
          // Optimistic update
          const { favorites } = get();
          const isFavorite = favorites.some((fav) => fav.id === movie.id);
          
          if (isFavorite) {
            set({ 
              favorites: favorites.filter((fav) => fav.id !== movie.id) 
            });
          } else {
            set({ favorites: [...favorites, movie] });
          }
          
          // API call
          const response = await api.post(`/users/favorites/${movie.id}`);
          
          if (!response.data.success) {
            // Revert on failure
            set({ favorites });
            toast.error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
            return;
          }
          
          toast.success(`"${movie.title}" ${isFavorite ? 'removed from' : 'added to'} favorites`);
        } catch (error) {
          // Revert on error
          const { favorites } = get();
          const isFavorite = favorites.some((fav) => fav.id === movie.id);
          
          if (isFavorite) {
            set({ 
              favorites: [...favorites.filter((fav) => fav.id !== movie.id), movie] 
            });
          } else {
            set({ 
              favorites: favorites.filter((fav) => fav.id !== movie.id) 
            });
          }
          
          toast.error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites: ${
            error.response?.data?.error || error.message
          }`);
        }
      },
      
      toggleWatchlist: async (movie) => {
        try {
          // Optimistic update
          const { watchlist } = get();
          const isInWatchlist = watchlist.some((item) => item.id === movie.id);
          
          if (isInWatchlist) {
            set({ 
              watchlist: watchlist.filter((item) => item.id !== movie.id) 
            });
          } else {
            set({ watchlist: [...watchlist, movie] });
          }
          
          // API call
          const response = await api.post(`/users/watchlist/${movie.id}`);
          
          if (!response.data.success) {
            // Revert on failure
            set({ watchlist });
            toast.error(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
            return;
          }
          
          toast.success(`"${movie.title}" ${isInWatchlist ? 'removed from' : 'added to'} watchlist`);
        } catch (error) {
          // Revert on error
          const { watchlist } = get();
          const isInWatchlist = watchlist.some((item) => item.id === movie.id);
          
          if (isInWatchlist) {
            set({ 
              watchlist: [...watchlist.filter((item) => item.id !== movie.id), movie] 
            });
          } else {
            set({ 
              watchlist: watchlist.filter((item) => item.id !== movie.id) 
            });
          }
          
          toast.error(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist: ${
            error.response?.data?.error || error.message
          }`);
        }
      },
      
      rateMovie: async (movieId, rating) => {
        try {
          // Optimistic update
          set(state => ({
            userRatings: {
              ...state.userRatings,
              [movieId]: rating
            }
          }));
          
          // API call
          await api.post(`/movies/rate/${movieId}`, { rating });
          
          const movie = get().movies.find(m => m.id === movieId) ||
                        get().searchResults.find(m => m.id === movieId) ||
                        get().currentMovie;
          
          if (movie) {
            toast.success(`You rated "${movie.title}" ${rating} stars`);
          }
        } catch (error) {
          // Revert on error
          const { userRatings } = get();
          const newRatings = { ...userRatings };
          delete newRatings[movieId];
          
          set({ userRatings: newRatings });
          
          toast.error(`Failed to rate movie: ${
            error.response?.data?.error || error.message
          }`);
        }
      },
      
      clearFavorites: () => set({ favorites: [] }),
      
      clearWatchlist: () => set({ watchlist: [] }),
      
      clearSearch: () => set({ searchResults: [], searchQuery: '' }),
      
      // Initialize state from localStorage
      initializeFromStorage: () => {
        // This function is mostly for documentation purposes
        // The persist middleware automatically handles storage
      },
      
      // Clear error state
      clearError: () => set({ error: null })
    }),
    {
      name: 'movie-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        watchlist: state.watchlist,
        userRatings: state.userRatings,
      }),
    }
  )
);

export default useMovieStore;