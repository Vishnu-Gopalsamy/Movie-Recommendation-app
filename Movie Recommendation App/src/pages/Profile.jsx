import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Paper, Avatar, Button, Grid,
  TextField, Divider, Chip, IconButton, Switch, FormControlLabel, 
  Card, CardContent, Tabs, Tab, FormGroup, Alert
} from '@mui/material';
import { Edit, Save, Add, Delete, MovieFilter, Favorite, Bookmark, Star } from '@mui/icons-material';
import './Profile.css';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Movie enthusiast and sci-fi lover',
    avatar: '',
    preferences: {
      genres: ['Action', 'Sci-Fi', 'Drama', 'Thriller'],
      notifications: true,
      darkMode: false,
      language: 'English'
    },
    stats: {
      watched: 42,
      watchlist: 15,
      reviews: 8,
      favorites: 12
    }
  });

  const handleEditToggle = () => {
    if (editMode) {
      // Save profile would happen here in a real app
      console.log('Saving profile:', profileData);
    }
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    // Simulate API save
    setTimeout(() => {
      setEditMode(false);
      console.log('Profile saved:', profileData);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked, value } = e.target;
    const type = e.target.type;
    
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const handleRemoveGenre = (genreToRemove) => {
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        genres: profileData.preferences.genres.filter(genre => genre !== genreToRemove)
      }
    });
  };

  const handleAddGenre = () => {
    const newGenre = prompt('Enter a genre to add to your preferences:');
    if (newGenre && !profileData.preferences.genres.includes(newGenre)) {
      setProfileData({
        ...profileData,
        preferences: {
          ...profileData.preferences,
          genres: [...profileData.preferences.genres, newGenre]
        }
      });
    }
  };

  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={profileData.avatar || "/default-avatar.png"} 
              sx={{ width: 120, height: 120, mr: 3 }}
              alt={profileData.name}
            />
            <Box>
              {editMode ? (
                <TextField
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  label="Name"
                  margin="dense"
                />
              ) : (
                <Typography variant="h4" gutterBottom>
                  {profileData.name}
                </Typography>
              )}
              
              <Typography variant="body1" color="text.secondary">
                {profileData.email}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="contained" 
            color={editMode ? "success" : "primary"}
            startIcon={editMode ? <Save /> : <Edit />}
            onClick={handleEditToggle}
          >
            {editMode ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            
            {editMode ? (
              <TextField
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                label="Bio"
                multiline
                rows={4}
                margin="dense"
              />
            ) : (
              <Typography variant="body1">
                {profileData.bio || "No bio provided."}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Genre Preferences
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {profileData.preferences.genres.map((genre) => (
                <Chip 
                  key={genre}
                  label={genre}
                  onDelete={editMode ? () => handleRemoveGenre(genre) : undefined}
                />
              ))}
              
              {editMode && (
                <Chip
                  icon={<Add />}
                  label="Add Genre"
                  variant="outlined"
                  onClick={handleAddGenre}
                />
              )}
            </Box>
            
            {editMode && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Click on a genre chip to remove it, or click "Add Genre" to add new ones.
              </Alert>
            )}
          </Grid>
          
          {editMode && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                App Settings
              </Typography>
              
              <FormGroup>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={profileData.preferences.notifications}
                      onChange={handlePreferenceChange}
                      name="notifications"
                    />
                  } 
                  label="Enable Notifications" 
                />
                
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={profileData.preferences.darkMode}
                      onChange={handlePreferenceChange}
                      name="darkMode"
                    />
                  } 
                  label="Dark Mode" 
                />
              </FormGroup>
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  select
                  label="Language"
                  name="language"
                  value={profileData.preferences.language}
                  onChange={handlePreferenceChange}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                </TextField>
              </Box>
            </Grid>
          )}
        </Grid>
        
        {editMode && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Activity Stats
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MovieFilter fontSize="large" color="primary" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {profileData.stats.watched}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watched Movies
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Bookmark fontSize="large" color="primary" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {profileData.stats.watchlist}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watchlist
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Star fontSize="large" color="primary" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {profileData.stats.reviews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reviews
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Favorite fontSize="large" color="primary" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {profileData.stats.favorites}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Favorites
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Recent Activity" />
          <Tab label="Favorites" />
          <Tab label="Watchlist" />
        </Tabs>
        
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderTop: 0 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Your Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You haven't logged any activity yet.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Explore Movies
              </Button>
            </Box>
          )}
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Your Favorites
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You don't have any favorite movies yet.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Find Movies to Love
              </Button>
            </Box>
          )}
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Your Watchlist
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your watchlist is empty.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Add Movies to Watch
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" color="error">
          Delete Account
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;