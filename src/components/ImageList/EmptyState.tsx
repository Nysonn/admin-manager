import React from "react";
import { Box, Paper, Typography, alpha, useTheme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import type { EmptyStateProps } from "./types";

/**
 * Empty state component shown when no images are uploaded
 */
const EmptyState: React.FC<EmptyStateProps> = ({ isMobile }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 6, sm: 10 },
        textAlign: 'center',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
        border: '2px dashed',
        borderColor: alpha(theme.palette.primary.main, 0.3),
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: { xs: 100, sm: 120 },
          height: { xs: 100, sm: 120 },
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
        }}
      >
        <ImageIcon sx={{ fontSize: { xs: 50, sm: 64 }, color: 'white' }} />
      </Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        fontWeight={700} 
        color="primary.main"
        sx={{ mb: 1.5 }}
      >
        No images uploaded yet
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ maxWidth: 480, mx: 'auto', mb: 4, lineHeight: 1.7 }}
      >
        Upload your first image to get started. Drag and drop files or click the upload zone above.
      </Typography>
    </Paper>
  );
};

export default EmptyState;
