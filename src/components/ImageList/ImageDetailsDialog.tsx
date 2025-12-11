import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Slide,
  alpha,
  useTheme,
  TextField as MuiTextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import StorageIcon from "@mui/icons-material/Storage";
import ImageIcon from "@mui/icons-material/Image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import type { ImageDetailsDialogProps } from "./types";

/**
 * Detailed information dialog for an image with editing capabilities
 */
const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({
  open,
  image,
  isEditing,
  tempFilename,
  onClose,
  onStartEdit,
  onFilenameChange,
  onSaveFilename,
  onCancelEdit,
  onCopyUrl,
  onReplace,
  onDownload,
  onDelete,
}) => {
  const theme = useTheme();

  if (!image) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Image Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Grid container spacing={3}>
          {/* Left: Image Preview */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'sticky', top: 0 }}>
              <Box
                component="img"
                src={image.url}
                alt={image.filename}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[300], 0.2),
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundImage: `
                    linear-gradient(45deg, ${alpha(theme.palette.grey[400], 0.2)} 25%, transparent 25%),
                    linear-gradient(-45deg, ${alpha(theme.palette.grey[400], 0.2)} 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, ${alpha(theme.palette.grey[400], 0.2)} 75%),
                    linear-gradient(-45deg, transparent 75%, ${alpha(theme.palette.grey[400], 0.2)} 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              />
            </Box>
          </Grid>

          {/* Right: Information Panel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Filename Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <FolderIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="overline" fontWeight={700} color="text.secondary">
                    Filename
                  </Typography>
                </Box>
                {isEditing ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <MuiTextField
                      autoFocus
                      size="small"
                      fullWidth
                      value={tempFilename}
                      onChange={(e) => onFilenameChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onSaveFilename(image, tempFilename);
                        }
                      }}
                    />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onSaveFilename(image, tempFilename)}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onCancelEdit}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ flex: 1 }}>
                      {image.filename}
                    </Typography>
                    <IconButton size="small" onClick={() => onStartEdit(image.filename)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Dimensions */}
              {image.width && image.height && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AspectRatioIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="overline" fontWeight={700} color="text.secondary">
                      Dimensions
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {image.width} × {image.height} pixels
                  </Typography>
                </Box>
              )}

              {/* File Size */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <StorageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="overline" fontWeight={700} color="text.secondary">
                    File Size
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>

              {/* Format */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ImageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="overline" fontWeight={700} color="text.secondary">
                    Format
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {image.filename?.split('.').pop()?.toUpperCase() || 'UNKNOWN'}
                </Typography>
              </Box>

              {/* Uploaded Date */}
              {image.uploadedAt && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="overline" fontWeight={700} color="text.secondary">
                      Uploaded
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' at '}
                    {new Date(image.uploadedAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Public URL */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinkIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="overline" fontWeight={700} color="text.secondary">
                    Public URL
                  </Typography>
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 1.5,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    {image.url}
                  </Typography>
                </Paper>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => onCopyUrl(image.url, image.filename, image.id.toString())}
                  sx={{ fontWeight: 600 }}
                >
                  Copy URL
                </Button>
              </Box>

              <Divider />

              {/* Action Buttons */}
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SwapHorizIcon />}
                  onClick={() => {
                    onReplace(image.id);
                    onClose();
                  }}
                  sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                  Replace Image
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => onDownload(image.url, image.filename)}
                  sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                  Download
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onDelete(image);
                    onClose();
                  }}
                  sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                  Delete Image
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;
