import React, { useState } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Toolbar,
  SaveButton,
  useRecordContext,
  useDataProvider,
} from "react-admin";
import { 
  Button, 
  Box, 
  Typography, 
  Chip, 
  Alert,
  Divider,
  Paper,
  InputAdornment,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { 
  Visibility as VisibilityIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import RichTextInput from "../../components/RichTextInput";

// Edit view for Pages
const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const validateRequired = (v: any) => (v ? undefined : "Required");

// Custom toolbar component with enhanced styling
const CustomToolbar: React.FC<any> = (toolbarProps) => {
  const record = useRecordContext();

  return (
    <Toolbar 
      {...toolbarProps}
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon sx={{ fontSize: 20, color: 'info.main' }} />
        <Typography variant="body2" color="text.secondary">
          Don't forget to save your changes
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => {
            const slug = record?.slug ?? record?.id;
            const previewUrl = `${window.location.origin}/preview/${slug}`;
            window.open(previewUrl, "_blank");
          }}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          Preview
        </Button>
        <SaveButton 
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
          }}
        />
      </Box>
    </Toolbar>
  );
};

// Enhanced SlugInput with real-time validation feedback
const SlugInput: React.FC<{ currentId?: number | string }> = ({ currentId }) => {
  const dataProvider = useDataProvider();
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checkSlug = async (value: string) => {
    if (!value) {
      setSlugStatus('idle');
      return "Required";
    }

    setSlugStatus('checking');
    try {
      // Try API-side filtering first
      const res = await dataProvider.getList("pages", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: { slug: value },
      });
      const list = Array.isArray((res as any).data) ? (res as any).data : [];
      // Exclude current record from conflict detection
      const conflict = list.find((p: any) => p?.slug === value && p?.id !== currentId);
      if (conflict) {
        setSlugStatus('taken');
        return "This slug is already in use";
      }
      setSlugStatus('available');
      return undefined;
    } catch (err) {
      console.warn("Slug check error", err);
      try {
        // Final fallback: fetch all and check locally
        const res = await dataProvider.getList("pages", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        });
        const list = Array.isArray((res as any).data) ? (res as any).data : [];
        const conflict = list.find((p: any) => p?.slug === value && p?.id !== currentId);
        if (conflict) {
          setSlugStatus('taken');
          return "This slug is already in use";
        }
      } catch {}
      setSlugStatus('idle');
      return undefined;
    }
  };

  const getEndAdornment = () => {
    if (slugStatus === 'checking') {
      return (
        <InputAdornment position="end">
          <CircularProgress size={20} />
        </InputAdornment>
      );
    }
    if (slugStatus === 'available') {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
        </InputAdornment>
      );
    }
    if (slugStatus === 'taken') {
      return (
        <InputAdornment position="end">
          <ErrorIcon sx={{ color: 'error.main', fontSize: 24 }} />
        </InputAdornment>
      );
    }
    return null;
  };

  return (
    <TextInput
      source="slug"
      label="Slug"
      validate={(value) => checkSlug(value)}
      helperText="URL-safe characters only. This will be part of the page URL."
      fullWidth
      InputProps={{
        endAdornment: getEndAdornment(),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  );
};

const PagesEdit: React.FC = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Wrapper to pass record id to SlugInput
  const SlugInputWithId = () => {
    const record = useRecordContext();
    return <SlugInput currentId={record?.id} />;
  };

  return (
    <Edit {...props}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} color="primary.main">
              Edit Page
            </Typography>
            <Chip
              label="Editing"
              color="primary"
              size="small"
              sx={{
                fontWeight: 700,
                height: 28,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Update your page content, metadata, and publish status. Changes are saved when you click Save.
          </Typography>
        </Paper>

        {/* Info Alert */}
        <Alert 
          severity="info" 
          icon={<InfoIcon />}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Quick Tips
          </Typography>
          <Typography variant="caption" component="div">
            • The slug is the URL-friendly identifier for this page
            <br />
            • Use the Preview button to see changes before publishing
            <br />
            • Draft pages are not visible to the public
          </Typography>
        </Alert>

        {/* Main Form */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SimpleForm 
            toolbar={<CustomToolbar />}
            sx={{
              '& .RaSimpleFormIterator-form': {
                padding: 0,
              },
            }}
          >
            {/* Basic Information Section */}
            <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <TextInput 
                    source="title" 
                    label="Page Title" 
                    validate={validateRequired} 
                    fullWidth
                    helperText="The main title that will be displayed on the page"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  
                  <SlugInputWithId />
                  
                  <Box>
                    <SelectInput 
                      source="status" 
                      choices={statusChoices}
                      fullWidth
                      helperText="Choose whether this page is visible to the public"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Content Section */}
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                  Page Content
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <RichTextInput 
                  source="content" 
                  label="Content" 
                  validate={validateRequired} 
                  fullWidth 
                />
              </Box>
            </Box>
          </SimpleForm>
        </Paper>

        {/* Footer Info */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Use the Preview button to review your changes before saving, or save as draft to continue editing later
          </Typography>
        </Box>
      </Box>
    </Edit>
  );
};

export default PagesEdit;
