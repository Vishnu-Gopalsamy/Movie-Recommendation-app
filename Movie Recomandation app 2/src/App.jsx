import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';

// Store
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const { isAuthenticated } = useAuthStore();
  const { mode, primaryColor, secondaryColor } = useThemeStore();

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: mode === 'light' ? '#8fa4f3' : '#9e9eff',
        dark: mode === 'light' ? '#4c63d2' : '#4355b8',
      },
      secondary: {
        main: secondaryColor,
        light: mode === 'light' ? '#9575cd' : '#a67fda',
        dark: mode === 'light' ? '#512da8' : '#43229a',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#1a202c' : '#e0e0e0',
        secondary: mode === 'light' ? '#4a5568' : '#a0aec0',
      },
    },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
}), [mode, primaryColor, secondaryColor]);

  const handleAuthModalOpen = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setAuthModalOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar onAuthModalOpen={handleAuthModalOpen} />
          
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route 
                path="/" 
                element={<HomePage onAuthModalOpen={handleAuthModalOpen} />} 
              />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              
              {/* Protected Routes */}
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <ProtectedRoute>
                    <WatchlistPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
          
          <Footer />

          {/* Auth Modal */}
          <AuthModal
            open={authModalOpen}
            onClose={handleAuthModalClose}
            initialMode={authModalMode}
          />

          {/* Toast Notifications */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;