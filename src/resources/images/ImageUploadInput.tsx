import React, { useCallback, useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress, 
  Grid, 
  IconButton,
  Fade,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Zoom,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useDataProvider, useNotify, useRefresh } from "react-admin";

type UploadItem = {
  id?: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploading: boolean;
  error?: string | null;
};

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

// ImageUploadInput: drag/drop + browse uploader
const ImageUploadInput: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      
      // Filter for valid image files
      const validFiles = Array.from(files).filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        
        if (!isValidType) {
          notify(`${file.name} is not a valid image file`, { type: "warning" });
        }
        if (!isValidSize) {
          notify(`${file.name} exceeds 5MB limit`, { type: "warning" });
        }
        
        return isValidType && isValidSize;
      });

      if (validFiles.length === 0) return;

      const arr = validFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
        error: null,
      })) as UploadItem[];

      // append
      setItems((prev) => [...arr, ...prev]);

      let successCount = 0;
      let errorCount = 0;

      // process each sequentially (you can parallelize if desired)
      for (const it of arr) {
        setItems((prev) => prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: true, progress: 50 } : p)));
        try {
          // Use dataProvider create method which now uses real API
          const record = {
            file: { rawFile: it.file }
          };

          await dataProvider.create("images", { data: record });

          setItems((prev) =>
            prev.map((p) =>
              p.previewUrl === it.previewUrl ? { ...p, uploading: false, progress: 100 } : p
            )
          );
          notify(`${it.file.name} uploaded successfully`, { type: "success" });
          successCount++;
          
          // Remove completed item after 2 seconds
          setTimeout(() => {
            removeItem(it.previewUrl);
          }, 2000);
        } catch (err: any) {
          setItems((prev) =>
            prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: false, error: err?.message ?? "Upload failed" } : p))
          );
          notify(`Upload failed: ${it.file.name}`, { type: "error" });
          errorCount++;
        }
      }

      // Refresh the gallery after all uploads complete
      if (successCount > 0) {
        refresh();
        notify(`Gallery refreshed - ${successCount} image${successCount !== 1 ? 's' : ''} added`, { 
          type: "info",
          autoHideDuration: 3000 
        });
      }
    },
    [dataProvider, notify, refresh]
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input value so same file can be selected again
    e.currentTarget.value = "";
  };

  const removeItem = (previewUrl: string) => {
    setItems((prev) => {
      prev.forEach((p) => {
        if (p.previewUrl === previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      return prev.filter((p) => p.previewUrl !== previewUrl);
    });
  };

  return (
    <Box>
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

      {items.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 2,
              fontWeight: 700,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ImageIcon fontSize="small" />
            Uploading {items.length} {items.length === 1 ? 'image' : 'images'}
          </Typography>
          <Grid container spacing={2}>
            {items.map((it, index) => (
              <Grid key={it.previewUrl} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Fade in timeout={300 + index * 100}>
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
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadInput;
