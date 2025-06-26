import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

// Sample movie data for development
const sampleMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
    release_date: "1994-09-23",
    vote_average: 8.7,
    vote_count: 24558,
    popularity: 97.234,
    genre_ids: [18, 80],
    original_language: "en",
    adult: false
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    release_date: "1972-03-14",
    vote_average: 8.7,
    vote_count: 18212,
    popularity: 87.681,
    genre_ids: [18, 80],
    original_language: "en",
    adult: false
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 30044,
    popularity: 89.746,
    genre_ids: [18, 28, 80, 53],
    original_language: "en",
    adult: false
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    release_date: "1994-09-10",
    vote_average: 8.5,
    vote_count: 25310,
    popularity: 83.452,
    genre_ids: [53, 80],
    original_language: "en",
    adult: false
  },
  {
    id: 5,
    title: "The Lord of the Rings: The Return of the King",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    backdrop_path: "/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg",
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord's realm.",
    release_date: "2003-12-01",
    vote_average: 8.5,
    vote_count: 21760,
    popularity: 82.651,
    genre_ids: [12, 14, 28],
    original_language: "en",
    adult: false
  },
  {
    id: 6,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 33862,
    popularity: 107.683,
    genre_ids: [28, 878, 12],
    original_language: "en",
    adult: false
  },
  {
    id: 7,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 26961,
    popularity: 72.242,
    genre_ids: [18],
    original_language: "en",
    adult: false
  },
  {
    id: 8,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 23309,
    popularity: 69.193,
    genre_ids: [28, 878],
    original_language: "en",
    adult: false
  }
];

// Mock API call to simulate fetching from an API
const mockApiCall = async (endpoint, params = {}, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (endpoint) {
        case 'popular':
          resolve({
            results: sampleMovies,
            total_pages: 1,
            total_results: sampleMovies.length,
          });
          break;
        case 'search':
          const { query } = params;
          const results = sampleMovies.filter((movie) =>
            movie.title.toLowerCase().includes(query.toLowerCase())
          );
          resolve({
            results,
            total_pages: 1,
            total_results: results.length,
          });
          break;
        case 'movie':
          const { id } = params;
          const movie = sampleMovies.find((m) => m.id === Number(id));
          resolve(movie || null);
          break;
        default:
          resolve({ results: [] });
      }
    }, delay);
  });
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
          const response = await mockApiCall('popular');
          set({ movies: response.results, loading: false });
        } catch (error) {
          console.error('Error fetching popular movies:', error);
          set({ 
            loading: false, 
            error: 'Failed to fetch popular movies. Please try again later.' 
          });
        }
      },
      
      searchMovies: async (query) => {
        if (!query.trim()) return;
        
        try {
          set({ loading: true, error: null, searchQuery: query });
          const response = await mockApiCall('search', { query });
          set({ searchResults: response.results, loading: false });
        } catch (error) {
          console.error('Error searching movies:', error);
          set({ 
            loading: false, 
            error: 'Failed to search movies. Please try again later.' 
          });
        }
      },
      
      fetchMovieDetails: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await mockApiCall('movie', { id });
          if (response) {
            set({ currentMovie: response, loading: false });
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
            error: 'Failed to fetch movie details. Please try again later.' 
          });
        }
      },
      
      toggleFavorite: (movie) => {
        const { favorites } = get();
        const isFavorite = favorites.some((fav) => fav.id === movie.id);
        
        if (isFavorite) {
          set({ 
            favorites: favorites.filter((fav) => fav.id !== movie.id) 
          });
          toast.success(`"${movie.title}" removed from favorites`);
        } else {
          set({ favorites: [...favorites, movie] });
          toast.success(`"${movie.title}" added to favorites`);
        }
      },
      
      toggleWatchlist: (movie) => {
        const { watchlist } = get();
        const isInWatchlist = watchlist.some((item) => item.id === movie.id);
        
        if (isInWatchlist) {
          set({ 
            watchlist: watchlist.filter((item) => item.id !== movie.id) 
          });
          toast.success(`"${movie.title}" removed from watchlist`);
        } else {
          set({ watchlist: [...watchlist, movie] });
          toast.success(`"${movie.title}" added to watchlist`);
        }
      },
      
      rateMovie: (movieId, rating) => {
        set(state => ({
          userRatings: {
            ...state.userRatings,
            [movieId]: rating
          }
        }));
        const movie = get().movies.find(m => m.id === movieId) ||
                      get().searchResults.find(m => m.id === movieId) ||
                      get().currentMovie;
        
        if (movie) {
          toast.success(`You rated "${movie.title}" ${rating} stars`);
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