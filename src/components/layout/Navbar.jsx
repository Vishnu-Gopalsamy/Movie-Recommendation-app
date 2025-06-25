import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home,
  Movie,
  Favorite,
  Person,
  Logout,
  Login,
  PersonAdd,
  Bookmark,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useMovieStore from '../../store/movieStore';

const Navbar = ({ onAuthModalOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { searchMovies } = useMovieStore();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMovies(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Discover', icon: <Movie />, path: '/discover' },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites' },
    { text: 'Watchlist', icon: <Bookmark />, path: '/watchlist' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          MovieFlix
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      {!isAuthenticated && (
        <>
          <Divider sx={{ my: 2 }} />
          <List>
            <ListItem
              button
              onClick={() => {
                onAuthModalOpen('login');
                setMobileOpen(false);
              }}
            >
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                onAuthModalOpen('register');
                setMobileOpen(false);
              }}
            >
              <ListItemIcon><PersonAdd /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MovieFlix
            </Typography>
          </motion.div>

          {!isMobile && (
            <Box sx={{ display: 'flex', ml: 4, gap: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
              maxWidth: isMobile ? 200 : 400,
              width: '100%',
            }}
          >
            <TextField
              size="small"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                },
              }}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Auth Section */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  p: 0,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <Person sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/favorites"
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <Favorite sx={{ mr: 2 }} />
                  Favorites
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/watchlist"
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  <Bookmark sx={{ mr: 2 }} />
                  Watchlist
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => onAuthModalOpen('login')}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onAuthModalOpen('register')}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;