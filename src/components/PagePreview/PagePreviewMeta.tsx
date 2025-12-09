import React from 'react';
import { Box, Typography, Chip, useTheme, useMediaQuery } from "@mui/material";
import { AccessTime, CalendarToday } from "@mui/icons-material";

interface PagePreviewMetaProps {
  title: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export const PagePreviewMeta: React.FC<PagePreviewMetaProps> = ({
  title,
  createdAt,
  updatedAt,
  status,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const createdDate = new Date(createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const updatedDate = new Date(updatedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Box
      sx={{
        background: '#667eea',
        p: { xs: 3, sm: 4, md: 5 },
        color: 'white',
      }}
    >
      <Typography 
        variant={isMobile ? "h4" : "h3"} 
        component="h1" 
        gutterBottom
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          mb: 3,
        }}
      >
        {title}
      </Typography>
      
      {/* Meta Information */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 3 },
          alignItems: 'center',
        }}
      >
        <Chip
          icon={<CalendarToday sx={{ fontSize: '1rem !important' }} />}
          label={`Created: ${createdDate}`}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 500,
            '& .MuiChip-icon': { color: 'white' },
          }}
        />
        <Chip
          icon={<AccessTime sx={{ fontSize: '1rem !important' }} />}
          label={`Updated: ${updatedDate}`}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 500,
            '& .MuiChip-icon': { color: 'white' },
          }}
        />
        <Chip
          label={formattedStatus}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: status === 'published' 
              ? 'rgba(76, 175, 80, 0.9)' 
              : 'rgba(255, 152, 0, 0.9)',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>
    </Box>
  );
};