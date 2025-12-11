import React from "react";
import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  DateField,
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
import { StatusField, TitleLinkField, ActionButtons } from "./DataGridFields";

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
        <Datagrid 
          bulkActionButtons={false} 
          rowClick={false}
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
                transform: 'scale(1.001)',
              },
            },
            '& .RaDatagrid-rowCell': {
              borderBottom: '1px solid',
              borderColor: alpha('#000', 0.06),
              py: 2.5,
              px: 2,
            },
          }}
        >
          <FunctionField 
            label="Title" 
            render={() => <TitleLinkField />}
            sx={{ minWidth: isMobile ? 150 : 250 }}
          />
          {!isMobile && (
            <TextField 
              source="slug" 
              sx={{ 
                color: 'text.secondary',
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                fontWeight: 500,
                backgroundColor: alpha('#000', 0.02),
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
              }} 
            />
          )}
          <FunctionField 
            label="Status" 
            render={() => <StatusField />}
          />
          {!isMobile && (
            <DateField 
              source="createdAt" 
              label="Created"
              showTime={false}
              sx={{ 
                color: 'text.secondary', 
                fontSize: '0.8125rem',
                fontWeight: 500,
              }}
            />
          )}
          <FunctionField 
            label="Actions" 
            render={() => <ActionButtons />}
            textAlign="right"
          />
        </Datagrid>
      </List>
    </Box>
  );
};

export default PagesListLayout;