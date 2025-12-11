import React from "react";
import {
  Paper,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import type { GalleryHeaderProps } from "./types";

/**
 * Gallery header with title and view toggle
 */
const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  view,
  onViewChange,
  isMobile,
}) => {
  const theme = useTheme();

  return (
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

      {/* View Toggle */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ mt: 2.5 }}>
        <Box sx={{ flex: 1 }} />

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => {
            if (v) onViewChange(v);
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
  );
};

export default GalleryHeader;
