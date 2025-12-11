import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  Stack,
  Chip,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import StorageIcon from "@mui/icons-material/Storage";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { ImagePreviewDialogProps } from "./types";
import { useKeyboardNavigation } from "../../hooks/useAccessibility";

/**
 * Full-screen image preview dialog with navigation
 * Includes keyboard navigation and accessibility features
 */
const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({
  open,
  image,
  currentIndex,
  totalImages,
  onClose,
  onNavigate,
  onCopyUrl,
  onDownload,
  onShowDetails,
}) => {
  if (!image) return null;

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalImages - 1;

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: onClose,
    onArrowLeft: canGoPrev ? () => onNavigate('prev') : undefined,
    onArrowRight: canGoNext ? () => onNavigate('next') : undefined,
  }, open);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Fade}
      aria-labelledby="image-preview-title"
      aria-describedby="image-preview-description"
      PaperProps={{
        sx: {
          borderRadius: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          backgroundImage: 'none',
          maxWidth: '100vw',
          maxHeight: '100vh',
          m: 0,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          aria-label="Close image preview"
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Main Image Display */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            p: 4,
            minHeight: 0,
          }}
        >
          {/* Previous Button */}
          {canGoPrev && (
            <IconButton
              onClick={() => onNavigate('prev')}
              sx={{
                position: 'absolute',
                left: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Image with Checkerboard Background */}
          <Box
            sx={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `
                linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
                linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box
              component="img"
              src={image.url}
              alt={image.filename}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 1,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            />
          </Box>

          {/* Next Button */}
          {canGoNext && (
            <IconButton
              onClick={() => onNavigate('next')}
              sx={{
                position: 'absolute',
                right: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>

        {/* Bottom Info Bar */}
        <Box
          sx={{
            p: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h6" color="white" gutterBottom fontWeight={600}>
                {image.filename}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {image.width && image.height && (
                  <Chip
                    icon={<AspectRatioIcon sx={{ color: 'white !important' }} />}
                    label={`${image.width} × ${image.height}`}
                    size="small"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={<StorageIcon sx={{ color: 'white !important' }} />}
                  label={`${(image.size / 1024 / 1024).toFixed(2)} MB`}
                  size="small"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  variant="outlined"
                />
                {image.uploadedAt && (
                  <Chip
                    icon={<CalendarTodayIcon sx={{ color: 'white !important' }} />}
                    label={new Date(image.uploadedAt).toLocaleString()}
                    size="small"
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => onCopyUrl(image.url, image.filename, image.id.toString())}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                Copy URL
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => onDownload(image.url, image.filename)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                Download
              </Button>
              <Button
                variant="contained"
                startIcon={<InfoIcon />}
                onClick={() => onShowDetails(image)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                Details
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
