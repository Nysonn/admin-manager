import React from "react";
import {
  List,
} from "react-admin";
import { 
  Box, 
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Article as ArticleIcon,
} from "@mui/icons-material";
import PageFilters from "./PageFilters";
import ListActions from "./ListActions";
import PagesTableWithSkeleton from "./PagesTableWithSkeleton";

const PagesListLayout: React.FC<any> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ pt: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <ArticleIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={700} 
            color="primary.main"
            sx={{ letterSpacing: '-0.02em' }}
          >
            Pages
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 7.5, lineHeight: 1.7 }}>
          Manage your website pages. Create, edit, and organize content for your site.
        </Typography>
      </Paper>

      {/* List Component */}
      <List 
        {...props} 
        filters={<PageFilters />} 
        actions={<ListActions />}
        sx={{
          '& .RaList-content': {
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.15),
            boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
            backgroundColor: 'background.paper',
          },
        }}
      >
        <PagesTableWithSkeleton />
      </List>
    </Box>
  );
};

export default PagesListLayout;