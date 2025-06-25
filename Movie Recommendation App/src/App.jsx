import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, Toolbar, IconButton, Typography, Button, Box, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, TextField, 
  InputAdornment, Avatar, Menu, MenuItem, useMediaQuery, Container,
  CssBaseline
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Home as HomeIcon, 
  Movie as MovieIcon, 
  Favorite as FavoriteIcon, 
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Import pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Recommendations from './pages/Recommendations';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import { MongoDBProvider } from './context/MongoDBContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    secondary: {
      main: '#e91e63',
      light: '#f48fb1',
      dark: '#c2185b',
      contrastText: '#fff'
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }
      }
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    // ...and so on (these are just the first 3)
  ]
});

function App() {
  const [favorites, setFavorites] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('movieFavorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (movie) => {
    const isFavorited = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={isMobile ? handleDrawerToggle : undefined}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'primary.main', 
            fontWeight: 600 
          }}
        >
          Movie Recommender
        </Typography>
      </Box>
      <List sx={{ py: 2 }}>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          sx={{ 
            borderRadius: '0 20px 20px 0', 
            mx: 1, 
            mb: 1,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/recommendations" 
          sx={{ 
            borderRadius: '0 20px 20px 0', 
            mx: 1, 
            mb: 1,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon>
            <MovieIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Discover" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/favorites" 
          sx={{ 
            borderRadius: '0 20px 20px 0', 
            mx: 1,
            mb: 1,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon>
            <FavoriteIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="Favorites" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/profile" 
          sx={{ 
            borderRadius: '0 20px 20px 0', 
            mx: 1,
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ListItemIcon>
            <PersonIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Profile" 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MongoDBProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed" color="default" elevation={0} sx={{ 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'background.paper',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              width: { sm: `calc(100% - ${250}px)` },
              ml: { sm: `${250}px` },
            }}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component={Link}
                  to="/"
                  sx={{ 
                    flexGrow: 1, 
                    display: { xs: 'none', sm: 'block' }, 
                    textDecoration: 'none', 
                    color: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  Movie Recommender
                </Typography>
                <Box 
                  component="form" 
                  onSubmit={handleSearchSubmit} 
                  sx={{ 
                    flexGrow: 1, 
                    maxWidth: 600, 
                    mx: 'auto',
                    display: 'flex'
                  }}
                >
                  <TextField
                    placeholder="Search movies..."
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: 1
                        },
                      },
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ 
                      ml: 1, 
                      borderRadius: 2,
                      minWidth: 'auto',
                      px: 2
                    }}
                  >
                    Search
                  </Button>
                </Box>
                <Box sx={{ flexGrow: 0, ml: 2 }}>
                  <IconButton 
                    onClick={handleMenuOpen} 
                    sx={{ 
                      p: 0,
                      border: '2px solid rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    <Avatar src="/default-avatar.png" alt="User" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ 
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem 
                      component={Link} 
                      to="/profile" 
                      onClick={handleMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      to="/favorites" 
                      onClick={handleMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <FavoriteIcon fontSize="small" />
                      </ListItemIcon>
                      Favorites
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      onClick={handleMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Toolbar>
            </AppBar>

            <Box component="nav">
              <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                sx={{
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 250,
                    border: 'none',
                    boxShadow: isMobile ? '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)' : 'none',
                    backgroundColor: 'background.paper',
                    ...(isMobile ? {} : { position: 'relative' })
                  },
                  ...(isMobile ? {} : { width: 250, flexShrink: 0 })
                }}
              >
                {drawer}
              </Drawer>
            </Box>

            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                p: 3, 
                width: '100%',
                pt: { xs: 8, sm: 9 }, // Add padding top to account for the AppBar height
              }}
            >
              <Container maxWidth="lg" sx={{ py: 3 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movie/:id" element={<MovieDetails onToggleFavorite={handleToggleFavorite} favorites={favorites} />} />
                  <Route 
                    path="/recommendations" 
                    element={<Recommendations favorites={favorites} onToggleFavorite={handleToggleFavorite} />} 
                  />
                  <Route 
                    path="/favorites" 
                    element={<Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} />} 
                  />
                  <Route path="/search" element={<SearchResults onToggleFavorite={handleToggleFavorite} favorites={favorites} />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Container>
            </Box>
            
            <Box 
              component="footer" 
              sx={{ 
                p: 3, 
                mt: 'auto', 
                backgroundColor: 'background.paper',
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                ml: isMobile ? 0 : '250px', 
                width: isMobile ? '100%' : 'calc(100% - 250px)',
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                  Movie Recommendation App &copy; {new Date().getFullYear()}
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </MongoDBProvider>
    </ThemeProvider>
  );
}

export default App;
