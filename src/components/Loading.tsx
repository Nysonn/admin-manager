import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingProps {
  message?: string;
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 40 }) => {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={size} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default Loading;
