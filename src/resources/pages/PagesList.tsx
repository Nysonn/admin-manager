// Pages list view using react-admin.
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  Filter,
  TextInput,
  SelectInput,
  useRecordContext,
  FunctionField,
  DateField,
} from "react-admin";
import { 
  Chip, 
  Link, 
  Box, 
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";

const PageFilters = (props: any) => {
  const theme = useTheme();
  
  return (
    <Filter {...props}>
      <TextInput 
        label="Search pages" 
        source="q" 
        alwaysOn
        placeholder="Search by title or content..."
        sx={{
          minWidth: { xs: '100%', sm: 320 },
          '& .MuiInputLabel-root': {
            fontWeight: 600,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            backgroundColor: alpha('#000', 0.02),
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.1)}`,
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'background.paper',
              boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          },
          '& .MuiInputAdornment-root': {
            marginRight: 1,
          },
          '& input::placeholder': {
            color: alpha(theme.palette.text.secondary, 0.6),
            opacity: 1,
          },
        }}
      />
      <SelectInput
        source="status"
        label="Filter by status"
        choices={[
          { id: "published", name: "Published" },
          { id: "draft", name: "Draft" },
        ]}
        alwaysOn={false}
        emptyValue={""}
        sx={{
          minWidth: 150,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.1)}`,
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'background.paper',
              boxShadow: `0 0 0 2px ${alpha('#1976d2', 0.2)}`,
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          },
        }}
      />
    </Filter>
  );
};

const ListActions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <TopToolbar
      sx={{
        gap: 1.5,
        '& .MuiButton-root': {
          borderRadius: 2,
          fontWeight: 600,
          textTransform: 'none',
          px: 2.5,
          py: 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
        },
      }}
    >
      <CreateButton 
        label={isMobile ? "" : "Create Page"}
        icon={<AddIcon />}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha('#1976d2', 0.3)}`,
          },
        }}
      />
    </TopToolbar>
  );
};

// Status chip for datagrid with enhanced styling
const StatusField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const isPublished = record.status === "published";
  
  return (
    <Chip 
      label={isPublished ? "Published" : "Draft"} 
      size="small" 
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: 1.5,
        backgroundColor: isPublished ? 'success.main' : alpha('#000', 0.08),
        color: isPublished ? 'white' : 'text.secondary',
        minWidth: 90,
        height: 24,
        transition: 'transform 0.15s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '& .MuiChip-label': {
          px: 1.75,
          py: 0.25,
        },
      }}
    />
  );
};

// Clickable title field with icon that navigates to preview
const TitleLinkField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slug = record.slug ?? record.id;
    window.open(`/preview/${slug}`, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <ArticleIcon sx={{ 
        fontSize: 20, 
        color: alpha('#1976d2', 0.6),
        transition: 'color 0.2s ease',
      }} />
      <Link
        href="#"
        onClick={handleClick}
        sx={{ 
          color: "primary.main",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: '0.9375rem',
          transition: 'all 0.2s ease',
          "&:hover": { 
            color: "primary.dark",
            textDecoration: "underline",
            textDecorationThickness: 2,
          },
          cursor: "pointer"
        }}
      >
        {record.title}
      </Link>
    </Box>
  );
};

// Custom action buttons with icons and tooltips
const ActionButtons: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = record.slug ?? record.id;
    window.open(`/preview/${slug}`, '_blank');
  };

  return (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Preview page" arrow placement="top">
        <IconButton
          size="small"
          onClick={handlePreview}
          sx={{
            color: 'info.main',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha('#0288d1', 0.12),
              transform: 'scale(1.1)',
            },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit page" arrow placement="top">
        <Box component="span">
          <EditButton 
            icon={<EditIcon fontSize="small" />}
            label=""
            sx={{
              minWidth: 'auto',
              p: 0.75,
              color: 'primary.main',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#1976d2', 0.12),
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
      </Tooltip>
      <Tooltip title="Delete page" arrow placement="top">
        <Box component="span">
          <DeleteButton 
            icon={<DeleteIcon fontSize="small" />}
            label=""
            sx={{
              minWidth: 'auto',
              p: 0.75,
              color: 'error.main',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#d32f2f', 0.12),
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
      </Tooltip>
    </Stack>
  );
};

const PagesList: React.FC = (props) => {
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

export default PagesList;
