import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;