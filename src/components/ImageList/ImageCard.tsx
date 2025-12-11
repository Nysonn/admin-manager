import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Checkbox,
  Chip,
  LinearProgress,
  Stack,
  Tooltip,
  Zoom,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import StorageIcon from "@mui/icons-material/Storage";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { ImageCardProps } from "./types";

/**
 * Individual image card component with thumbnail and actions
 * Memoized to prevent unnecessary re-renders
 */
const ImageCard: React.FC<ImageCardProps> = React.memo(({
  record,
  progress,
  isHovered,
  isSelected,
  copyFeedback,
  onHover,
  onSelect,
  onPreview,
  onMenuOpen,
  onCopyUrl,
  inputRef,
  onReplaceFile,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isUploading = progress > 0 && progress < 100;

  return (
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
      onMouseEnter={() => onHover(record.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Selection Checkbox */}
      <Checkbox
        checked={isSelected}
        onChange={() => onSelect(record.id)}
        icon={<CheckBoxOutlineBlankIcon />}
        checkedIcon={<CheckBoxIcon />}
        inputProps={{ 'aria-label': `Select image ${record.filename}` }}
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
        onClick={() => onPreview(record)}
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
                onPreview(record);
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
              onClick={(e) => onMenuOpen(e, record)}
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
        ref={inputRef}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          e.currentTarget.value = "";
          onReplaceFile(record, f);
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
          startIcon={copyFeedback ? <CheckIcon /> : <ContentCopyIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onCopyUrl(record.url, record.filename, record.id.toString());
          }}
          sx={{
            mt: 'auto',
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8125rem',
            py: 0.75,
            borderColor: copyFeedback ? 'success.main' : 'primary.main',
            color: copyFeedback ? 'success.main' : 'primary.main',
            backgroundColor: copyFeedback 
              ? alpha(theme.palette.success.main, 0.08)
              : alpha(theme.palette.primary.main, 0.04),
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: copyFeedback ? 'success.dark' : 'primary.dark',
              backgroundColor: copyFeedback
                ? alpha(theme.palette.success.main, 0.15)
                : alpha(theme.palette.primary.main, 0.12),
              transform: 'translateY(-1px)',
              boxShadow: copyFeedback
                ? `0 2px 8px ${alpha(theme.palette.success.main, 0.25)}`
                : `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
            },
          }}
        >
          {copyFeedback ? 'Copied!' : 'Copy URL'}
        </Button>
      </CardContent>
    </Card>
  );
});

export default ImageCard;
