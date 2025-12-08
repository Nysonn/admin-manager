import React, { useState, useRef, useMemo } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  useListContext,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardMedia,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  Zoom,
  useTheme,
  useMediaQuery,
  Paper,
  alpha,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Stack,
  Checkbox,
  Divider,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  TextField as MuiTextField,
  Fade,
  Slide,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ImageIcon from "@mui/icons-material/Image";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import LinkIcon from "@mui/icons-material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StorageIcon from "@mui/icons-material/Storage";
import WarningIcon from "@mui/icons-material/Warning";
import ImageUploadInput from "./ImageUploadInput";

/**
 * Professional Image Management GridBody Component
 * Features: Drag-drop upload, grid/list views, bulk actions, detailed modals, animations
 */
interface GridBodyProps {}

const GridBody: React.FC<GridBodyProps> = () => {
  const { data } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State management
  const [progressMap, setProgressMap] = useState<Record<number | string, number>>({});
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number | string>>(new Set());
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [imageDetails, setImageDetails] = useState<any | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuImage, setMenuImage] = useState<any | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<Record<string, boolean>>({});
  const [editingFilename, setEditingFilename] = useState<string | null>(null);
  const [tempFilename, setTempFilename] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Use data directly without filtering or sorting
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const currentImageIndex = useMemo(() => {
    if (!previewImage || !filteredAndSortedData) return -1;
    return filteredAndSortedData.findIndex((img: any) => img.id === previewImage.id);
  }, [previewImage, filteredAndSortedData]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentImageIndex === -1) return;
    const newIndex = direction === 'prev' ? currentImageIndex - 1 : currentImageIndex + 1;
    if (newIndex >= 0 && newIndex < filteredAndSortedData.length) {
      setPreviewImage(filteredAndSortedData[newIndex]);
    }
  };

  const startReplace = (recordId: number | string) => {
    // trigger hidden file input click
    const input = inputRefs.current[String(recordId)];
    if (input) {
      input.click();
    }
  };

  const handleCopyUrl = (url: string, _filename: string, id?: string) => {
    navigator.clipboard.writeText(url);
    notify(`URL copied! ✓`, { type: "success" });
    if (id) {
      setCopyFeedback({ ...copyFeedback, [id]: true });
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Downloading ${filename}`, { type: "info" });
  };

  const handleReplaceFile = async (record: any, file?: File | null) => {
    if (!file) return;
    try {
      setProgressMap((p) => ({ ...p, [record.id]: 50 }));

      // Use the dataProvider update method which now uses real API
      await dataProvider.update("images", { 
        id: record.id, 
        data: { file: { rawFile: file } }, 
        previousData: record 
      });

      notify(`Replaced ${record.filename}`, { type: "success" });
      setProgressMap((p) => ({ ...p, [record.id]: 100 }));

      // refresh list to show updated thumbnails / metadata
      refresh();
      setTimeout(() => {
        setProgressMap((p) => ({ ...p, [record.id]: 0 }));
      }, 1000);
    } catch (err: any) {
      console.error("Replace failed", err);
      notify(`Replace failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
      setProgressMap((p) => ({ ...p, [record.id]: 0 }));
    }
  };

  const handleDelete = async (record: any) => {
    setDeleteTarget(record);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dataProvider.delete("images", { id: deleteTarget.id, previousData: deleteTarget });
      notify(`Image deleted successfully ✓`, { type: "success" });
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(deleteTarget.id);
        return newSet;
      });
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      setImageDetails(null);
      refresh();
    } catch (err: any) {
      console.error("Delete failed", err);
      notify(`Delete failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const handleFilenameEdit = async (record: any, newName: string) => {
    if (!newName || newName === record.filename) {
      setEditingFilename(null);
      return;
    }
    
    try {
      const updated = { ...record, filename: newName };
      await dataProvider.update("images", { 
        id: record.id, 
        data: updated, 
        previousData: record 
      });
      notify(`Filename updated ✓`, { type: "success" });
      setEditingFilename(null);
      if (imageDetails?.id === record.id) {
        setImageDetails(updated);
      }
      refresh();
    } catch (err: any) {
      notify(`Failed to update filename: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    const ok = window.confirm(`Delete ${selectedImages.size} images? This action cannot be undone.`);
    if (!ok) return;
    
    try {
      const deletePromises = Array.from(selectedImages).map(id => {
        const record = data?.find((r: any) => r.id === id);
        return dataProvider.delete("images", { id, previousData: record });
      });
      
      await Promise.all(deletePromises);
      notify(`Deleted ${selectedImages.size} images`, { type: "success" });
      setSelectedImages(new Set());
      refresh();
    } catch (err: any) {
      console.error("Bulk delete failed", err);
      notify(`Bulk delete failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const toggleSelectImage = (id: number | string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    if (selectedImages.size === data?.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(data?.map((r: any) => r.id) || []));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, image: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuImage(image);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuImage(null);
  };

  // Empty states
  if (!data || data.length === 0) {
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
  }

  if (filteredAndSortedData.length === 0 && data && data.length > 0) {
    // This case shouldn't happen now that we removed filtering
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedImages.size > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            mb: 2,
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Checkbox
              checked={selectedImages.size === data?.length}
              indeterminate={selectedImages.size > 0 && selectedImages.size < data?.length}
              onChange={selectAllImages}
              sx={{ 
                color: 'white',
                '&.Mui-checked': { color: 'white' },
                '&.MuiCheckbox-indeterminate': { color: 'white' },
              }}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
              }}
            >
              Delete Selected
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSelectedImages(new Set())}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { 
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Professional Image Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        {filteredAndSortedData?.map((record: any) => {
        if (!record) return null;
        const progress = progressMap[record.id] ?? 0;
        const isHovered = hoveredCard === record.id;
        const isUploading = progress > 0 && progress < 100;
        const isSelected = selectedImages.has(record.id);

        return (
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card 
              sx={{ 
                position: "relative",
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid',
                borderColor: isSelected 
                  ? 'primary.main'
                  : isHovered 
                  ? 'primary.light' 
                  : 'divider',
                boxShadow: isSelected
                  ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.35)}`
                  : isHovered 
                  ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.25)}` 
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                transform: isHovered || isSelected ? 'translateY(-8px)' : 'translateY(0)',
                '&:hover': {
                  '& .action-buttons': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                  '& .card-media': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onMouseEnter={() => setHoveredCard(record.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Selection Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={() => toggleSelectImage(record.id)}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 24,
                  },
                }}
              />
              {/* Thumbnail Container */}
              <Box 
                sx={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  backgroundColor: 'grey.100',
                  height: 220,
                  cursor: 'pointer',
                }}
                onClick={() => setPreviewImage(record)}
              >
                <CardMedia
                  className="card-media"
                  component="img"
                  height="220"
                  image={record.thumbnailUrl || record.url}
                  alt={record.filename}
                  sx={{ 
                    objectFit: "cover",
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />

                {/* Gradient Overlay on Hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Action Buttons Overlay */}
                <Box 
                  className="action-buttons"
                  sx={{ 
                    position: "absolute", 
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    opacity: isMobile ? 1 : 0,
                    transform: isMobile ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    padding: 1,
                  }}
                >
                  <Tooltip title="View Full Size" arrow TransitionComponent={Zoom}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(record);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="More Actions" arrow TransitionComponent={Zoom}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, record)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Dimensions Badge */}
                {record.width && record.height && !isSelected && (
                  <Chip
                    icon={<AspectRatioIcon sx={{ fontSize: '0.875rem !important' }} />}
                    label={`${record.width}×${record.height}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 26,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}

                {/* Upload Progress Overlay */}
                {isUploading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight={700}>
                      {progress}%
                    </Typography>
                    <Box sx={{ width: '80%' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Hidden file input for replace */}
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={(el) => {
                  inputRefs.current[String(record.id)] = el;
                }}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  // clear value so same file can be selected later
                  e.currentTarget.value = "";
                  handleReplaceFile(record, f);
                }}
              />

              {/* Card Info Section */}
              <CardContent sx={{ pt: 2.5, pb: 2, px: 2.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Filename */}
                <Tooltip title={record.filename} arrow placement="top">
                  <Typography 
                    variant="subtitle2" 
                    noWrap
                    fontWeight={700}
                    sx={{ 
                      color: '#212121',
                      fontSize: '0.875rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {record.filename}
                  </Typography>
                </Tooltip>

                {/* Metadata */}
                <Stack spacing={0.75}>
                  {/* Dimensions */}
                  {record.width && record.height && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <AspectRatioIcon sx={{ fontSize: 16, color: '#757575' }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#757575', fontWeight: 500 }}>
                        {record.width} × {record.height}
                      </Typography>
                    </Box>
                  )}

                  {/* File Size */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <StorageIcon sx={{ fontSize: 16, color: '#757575' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#757575', fontWeight: 500 }}>
                      {record.size ? `${(record.size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                    </Typography>
                  </Box>

                  {/* Upload Date */}
                  {record.uploadedAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: '#757575' }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#757575', fontWeight: 500 }}>
                        {new Date(record.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Copy URL Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={copyFeedback[record.id] ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(record.url, record.filename, record.id);
                  }}
                  sx={{
                    mt: 'auto',
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    py: 0.75,
                    borderColor: copyFeedback[record.id] ? 'success.main' : 'primary.main',
                    color: copyFeedback[record.id] ? 'success.main' : 'primary.main',
                    backgroundColor: copyFeedback[record.id] 
                      ? alpha(theme.palette.success.main, 0.08)
                      : alpha(theme.palette.primary.main, 0.04),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: copyFeedback[record.id] ? 'success.dark' : 'primary.dark',
                      backgroundColor: copyFeedback[record.id]
                        ? alpha(theme.palette.success.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.12),
                      transform: 'translateY(-1px)',
                      boxShadow: copyFeedback[record.id]
                        ? `0 2px 8px ${alpha(theme.palette.success.main, 0.25)}`
                        : `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                  }}
                >
                  {copyFeedback[record.id] ? 'Copied!' : 'Copy URL'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>

      {/* Professional Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="xl"
        fullWidth
        TransitionComponent={Fade}
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
            onClick={() => setPreviewImage(null)}
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

          {previewImage && (
            <>
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
                {currentImageIndex > 0 && (
                  <IconButton
                    onClick={() => navigateImage('prev')}
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
                    src={previewImage.url}
                    alt={previewImage.filename}
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
                {currentImageIndex < filteredAndSortedData.length - 1 && (
                  <IconButton
                    onClick={() => navigateImage('next')}
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
                      {previewImage.filename}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip
                        icon={<AspectRatioIcon sx={{ color: 'white !important' }} />}
                        label={`${previewImage.width} × ${previewImage.height}`}
                        size="small"
                        sx={{ 
                          color: 'white', 
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                        variant="outlined"
                      />
                      <Chip
                        icon={<StorageIcon sx={{ color: 'white !important' }} />}
                        label={`${(previewImage.size / 1024 / 1024).toFixed(2)} MB`}
                        size="small"
                        sx={{ 
                          color: 'white', 
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                        variant="outlined"
                      />
                      {previewImage.uploadedAt && (
                        <Chip
                          icon={<CalendarTodayIcon sx={{ color: 'white !important' }} />}
                          label={new Date(previewImage.uploadedAt).toLocaleString()}
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
                      onClick={() => {
                        if (previewImage) {
                          handleCopyUrl(previewImage.url, previewImage.filename, previewImage.id);
                        }
                      }}
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
                      onClick={() => {
                        if (previewImage) {
                          handleDownload(previewImage.url, previewImage.filename);
                        }
                      }}
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
                      onClick={() => {
                        if (previewImage) {
                          setImageDetails(previewImage);
                          setPreviewImage(null);
                        }
                      }}
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
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (menuImage) {
              handleCopyUrl(menuImage.url, menuImage.filename);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy URL</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuImage) {
              handleDownload(menuImage.url, menuImage.filename);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuImage) {
              startReplace(menuImage.id);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Replace</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuImage) {
              setImageDetails(menuImage);
              handleMenuClose();
            }
          }}
        >
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (menuImage) {
              handleDelete(menuImage);
              handleMenuClose();
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Professional Image Details Dialog */}
      <Dialog
        open={!!imageDetails}
        onClose={() => {
          setImageDetails(null);
          setEditingFilename(null);
        }}
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
        {imageDetails && (
          <>
            <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  Image Details
                </Typography>
                <IconButton
                  onClick={() => {
                    setImageDetails(null);
                    setEditingFilename(null);
                  }}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={3}>
                {/* Left: Image Preview */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      position: 'sticky',
                      top: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={imageDetails.url}
                      alt={imageDetails.filename}
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
                      {editingFilename === imageDetails.id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <MuiTextField
                            autoFocus
                            size="small"
                            fullWidth
                            value={tempFilename}
                            onChange={(e) => setTempFilename(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleFilenameEdit(imageDetails, tempFilename);
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleFilenameEdit(imageDetails, tempFilename)}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditingFilename(null)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight={600} sx={{ flex: 1 }}>
                            {imageDetails.filename}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingFilename(imageDetails.id);
                              setTempFilename(imageDetails.filename);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    <Divider />

                    {/* Dimensions */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AspectRatioIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="overline" fontWeight={700} color="text.secondary">
                          Dimensions
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {imageDetails.width} × {imageDetails.height} pixels
                      </Typography>
                    </Box>

                    {/* File Size */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <StorageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="overline" fontWeight={700} color="text.secondary">
                          File Size
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {(imageDetails.size / 1024 / 1024).toFixed(2)} MB
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
                        {imageDetails.filename?.split('.').pop()?.toUpperCase() || 'UNKNOWN'}
                      </Typography>
                    </Box>

                    {/* Uploaded Date */}
                    {imageDetails.uploadedAt && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          <Typography variant="overline" fontWeight={700} color="text.secondary">
                            Uploaded
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                          {new Date(imageDetails.uploadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}{' at '}
                          {new Date(imageDetails.uploadedAt).toLocaleTimeString('en-US', {
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
                          {imageDetails.url}
                        </Typography>
                      </Paper>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => {
                          handleCopyUrl(imageDetails.url, imageDetails.filename, imageDetails.id);
                        }}
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
                          startReplace(imageDetails.id);
                          setImageDetails(null);
                        }}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Replace Image
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                          handleDownload(imageDetails.url, imageDetails.filename);
                        }}
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
                          handleDelete(imageDetails);
                          setImageDetails(null);
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
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        {deleteTarget && (
          <>
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
                  src={deleteTarget.thumbnailUrl || deleteTarget.url}
                  alt={deleteTarget.filename}
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
                {deleteTarget.filename}
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
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
                sx={{ fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={confirmDelete}
                startIcon={<DeleteIcon />}
                sx={{ fontWeight: 600 }}
              >
                Delete Anyway
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

const ImagesListContent: React.FC<{
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}> = ({ view, setView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
        {/* Professional Header Section with Camera Icon */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4 },
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <CameraAltIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  fontWeight={700} 
                  color="primary.main"
                  sx={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
                >
                  Image Gallery
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Manage and organize your media assets
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* View Toggle Only - Search and Sort removed */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mt: 2.5 }}>
            <Box sx={{ flex: 1 }} />

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => {
                if (v) setView(v);
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 1.5,
                  px: 2,
                  border: '2px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        {/* Upload Zone */}
        <Box sx={{ mb: 3 }}>
          <ImageUploadInput />
        </Box>

        {/* Content Area */}
        {view === "grid" ? (
          <GridBody />
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
            }}
          >
            <Datagrid 
              rowClick="edit"
              sx={{
                '& .RaDatagrid-headerCell': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  py: 2.5,
                },
                '& .RaDatagrid-row': {
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                },
                '& .RaDatagrid-rowCell': {
                  borderBottom: '1px solid',
                  borderColor: alpha('#000', 0.06),
                  py: 2,
                },
              }}
            >
              <TextField source="filename" />
              <TextField source="url" />
              <TextField source="size" label="Size (bytes)" />
              <DateField source="uploadedAt" showTime />
            </Datagrid>
          </Paper>
        )}
      </Box>
  );
};

const ImagesList: React.FC = (props) => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <List {...props} perPage={48}>
      <ImagesListContent
        view={view}
        setView={setView}
      />
    </List>
  );
};

export default ImagesList;
