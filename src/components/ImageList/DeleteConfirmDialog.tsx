import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import type { DeleteConfirmDialogProps } from "./types";

/**
 * Confirmation dialog for deleting an image
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  image,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();

  if (!image) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            }}
          >
            <WarningIcon sx={{ fontSize: 28, color: 'error.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Delete Image?
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={image.thumbnailUrl || image.url}
            alt={image.filename}
            sx={{
              maxWidth: 200,
              maxHeight: 150,
              objectFit: 'contain',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'error.main',
            }}
          />
        </Box>

        <Typography variant="body1" fontWeight={600} gutterBottom textAlign="center">
          {image.filename}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: alpha(theme.palette.error.main, 0.05),
            border: '1px solid',
            borderColor: alpha(theme.palette.error.main, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="error.main" fontWeight={600}>
            ⚠️ This action cannot be undone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            The image will be permanently deleted from your library.
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{ fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<DeleteIcon />}
          sx={{ fontWeight: 600 }}
        >
          Delete Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
