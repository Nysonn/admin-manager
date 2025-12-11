import React from "react";
import { 
  Box, 
  Typography, 
  LinearProgress, 
  IconButton,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Zoom,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import type { UploadItem } from "../../hooks/useImageUploadLogic";

interface UploadItemCardProps {
  item: UploadItem;
  kb: (n: number) => string;
  removeItem: (previewUrl: string) => void;
  index: number;
}

const UploadItemCard: React.FC<UploadItemCardProps> = ({ item: it, kb, removeItem }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 1.5,
        position: "relative",
        borderRadius: 2,
        border: '1px solid',
        borderColor: it.error ? 'error.main' : it.progress === 100 ? 'success.main' : 'divider',
        backgroundColor: it.error 
          ? alpha(theme.palette.error.main, 0.04)
          : it.progress === 100
          ? alpha(theme.palette.success.main, 0.04)
          : 'background.paper',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Image Preview */}
      <Box 
        sx={{ 
          position: 'relative',
          borderRadius: 1.5,
          overflow: 'hidden',
          backgroundColor: 'grey.100',
        }}
      >
        <img
          src={it.previewUrl}
          alt={it.file.name}
          style={{ 
            width: "100%", 
            height: 160, 
            objectFit: "cover", 
            display: "block",
          }}
        />

        {/* Status Overlay */}
        {(it.uploading || it.progress === 100 || it.error) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: it.error 
                ? 'rgba(0, 0, 0, 0.6)'
                : it.progress === 100
                ? 'rgba(76, 175, 80, 0.15)'
                : 'rgba(0, 0, 0, 0.4)',
            }}
          >
            {it.error ? (
              <ErrorIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'error.main',
                  animation: 'shake 0.5s ease-in-out',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-10px)' },
                    '75%': { transform: 'translateX(10px)' },
                  },
                }} 
              />
            ) : it.progress === 100 ? (
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'success.main',
                  animation: 'scaleIn 0.5s ease-out',
                  '@keyframes scaleIn': {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }} 
              />
            ) : (
              <Typography 
                variant="h5" 
                color="white" 
                fontWeight={700}
              >
                {it.progress}%
              </Typography>
            )}
          </Box>
        )}

        {/* Delete Button */}
        <Tooltip title="Remove" arrow TransitionComponent={Zoom}>
          <IconButton
            size="small"
            onClick={() => removeItem(it.previewUrl)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* File Info */}
      <Box sx={{ mt: 1.5 }}>
        <Tooltip title={it.file.name} arrow>
          <Typography 
            variant="body2" 
            noWrap
            fontWeight={600}
            sx={{ mb: 0.5, color: 'text.primary' }}
          >
            {it.file.name}
          </Typography>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={kb(it.file.size)}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          />
          {it.error && (
            <Typography 
              variant="caption" 
              color="error.main"
              fontWeight={600}
              sx={{ fontSize: '0.7rem' }}
            >
              Failed
            </Typography>
          )}
          {it.progress === 100 && !it.error && (
            <Typography 
              variant="caption" 
              color="success.main"
              fontWeight={600}
              sx={{ fontSize: '0.7rem' }}
            >
              Complete
            </Typography>
          )}
        </Box>

        {/* Progress Bar */}
        {it.uploading && it.progress < 100 && (
          <LinearProgress 
            variant="determinate" 
            value={it.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        )}

        {/* Error Message */}
        {it.error && (
          <Typography 
            variant="caption" 
            color="error.main"
            sx={{ 
              display: 'block',
              mt: 0.5,
              fontSize: '0.7rem',
            }}
          >
            {it.error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default UploadItemCard;