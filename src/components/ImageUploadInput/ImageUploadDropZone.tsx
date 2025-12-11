import React from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Zoom,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import type { ImageUploadLogic } from "../../hooks/useImageUploadLogic";

interface ImageUploadDropZoneProps {
  logic: ImageUploadLogic;
}

const ImageUploadDropZone: React.FC<ImageUploadDropZoneProps> = ({ logic }) => {
  const { isDragging, onDragEnter, onDragLeave, onDrop, onBrowse, items } = logic;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Paper
      elevation={0}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      sx={{
        p: { xs: 3, sm: 4 },
        mb: items.length > 0 ? 3 : 0,
        textAlign: "center",
        borderRadius: 3,
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        backgroundColor: isDragging 
          ? alpha(theme.palette.primary.main, 0.08) 
          : 'background.paper',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&::before': isDragging ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          animation: 'pulse 1.5s ease-in-out infinite',
        } : {},
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <Zoom in timeout={300}>
        <Box
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            borderRadius: '50%',
            background: isDragging 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            transition: 'all 0.3s ease',
            transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isDragging 
              ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`
              : `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <CloudUploadIcon 
            sx={{ 
              fontSize: { xs: 40, sm: 50 },
              color: isDragging ? 'white' : 'primary.main',
              transition: 'all 0.3s ease',
            }} 
          />
        </Box>
      </Zoom>

      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        gutterBottom
        fontWeight={700}
        sx={{
          background: '#9fade9ff',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        {isDragging ? "Drop images here!" : "Upload Images"}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {isDragging 
          ? "Release to upload your images" 
          : "Drag & drop your images here, or click to browse"}
      </Typography>

      <Button 
        variant="contained" 
        component="label" 
        size={isMobile ? "medium" : "large"}
        startIcon={<ImageIcon />}
        sx={{
          borderRadius: 2,
          px: { xs: 3, sm: 4 },
          py: { xs: 1, sm: 1.5 },
          fontWeight: 600,
          background: '#667eea',
          boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        Browse Files
        <input hidden type="file" accept="image/*" multiple onChange={onBrowse} />
      </Button>

      <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Chip 
          icon={<InsertDriveFileIcon />}
          label="PNG, JPG, GIF, WebP" 
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: 'info.main',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
        <Chip 
          label="Max 5 MB per file" 
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            color: 'success.main',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>
    </Paper>
  );
};

export default ImageUploadDropZone;