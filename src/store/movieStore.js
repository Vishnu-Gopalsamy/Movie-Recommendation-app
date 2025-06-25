import { create } from 'zustand';
import { movieApi } from '../services/movieApi';

const useMovieStore = create((set, get) => ({
  // State
  movies: [],
  favorites: [],
  watchlist: [],
  searchResults: [],
  currentMovie: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    genre: '',
    year: '',
    rating: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  clearError: () => set({ error: null }),

  // Movie operations
  fetchPopularMovies: async () => {
    set({ loading: true, error: null });
    try {
      const data = await movieApi.getPopularMovies();
      set({ movies: data.results || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchMovies: async (query) => {
    if (!query.trim()) return;
    
    set({ loading: true, error: null, searchQuery: query });
    try {
      const data = await movieApi.searchMovies(query);
      set({ searchResults: data.results || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMovieDetails: async (movieId) => {
    set({ loading: true, error: null });
    try {
      const movie = await movieApi.getMovieDetails(movieId);
      set({ currentMovie: movie, loading: false });
      return movie;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Favorites management
  addToFavorites: (movie) => {
    const favorites = get().favorites;
    if (!favorites.find(fav => fav.id === movie.id)) {
      const newFavorites = [...favorites, movie];
      set({ favorites: newFavorites });
      localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
    }
  },

  removeFromFavorites: (movieId) => {
    const newFavorites = get().favorites.filter(fav => fav.id !== movieId);
    set({ favorites: newFavorites });
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
  },

  toggleFavorite: (movie) => {
    const favorites = get().favorites;
    const isFavorite = favorites.find(fav => fav.id === movie.id);
    
    if (isFavorite) {
      get().removeFromFavorites(movie.id);
    } else {
      get().addToFavorites(movie);
    }
  },

  // Watchlist management
  addToWatchlist: (movie) => {
    const watchlist = get().watchlist;
    if (!watchlist.find(item => item.id === movie.id)) {
      const newWatchlist = [...watchlist, movie];
      set({ watchlist: newWatchlist });
      localStorage.setItem('movieWatchlist', JSON.stringify(newWatchlist));
    }
  },

  removeFromWatchlist: (movieId) => {
    const newWatchlist = get().watchlist.filter(item => item.id !== movieId);
    set({ watchlist: newWatchlist });
    localStorage.setItem('movieWatchlist', JSON.stringify(newWatchlist));
  },

  toggleWatchlist: (movie) => {
    const watchlist = get().watchlist;
    const isInWatchlist = watchlist.find(item => item.id === movie.id);
    
    if (isInWatchlist) {
      get().removeFromWatchlist(movie.id);
    } else {
      get().addToWatchlist(movie);
    }
  },

  // Initialize from localStorage
  initializeFromStorage: () => {
    try {
      const savedFavorites = localStorage.getItem('movieFavorites');
      const savedWatchlist = localStorage.getItem('movieWatchlist');
      
      if (savedFavorites) {
        set({ favorites: JSON.parse(savedFavorites) });
      }
      
      if (savedWatchlist) {
        set({ watchlist: JSON.parse(savedWatchlist) });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  },
}));

export default useMovieStore;