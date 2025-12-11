import React from "react";
import {
  SimpleForm,
  TextInput,
  SelectInput,
  useRecordContext,
  useEditContext,
} from "react-admin";
import { 
  Box, 
  Typography, 
  Chip, 
  Alert,
  Divider,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
} from "@mui/material";
import { 
  Info as InfoIcon,
} from "@mui/icons-material";
import RichTextInput from "../../components/RichTextInput/RichTextInput";
import CustomToolbar from "./CustomToolbar";
import SlugInputWithValidation from "./SlugInputWithValidation";

const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const validateRequired = (v: string | undefined) => (v ? undefined : "Required");

const PageEditFormLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const record = useRecordContext();
  const { isLoading } = useEditContext();
  
  const currentId = record?.id;

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        {/* Header Skeleton */}
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
            <Skeleton variant="text" width={150} height={40} />
            <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: 2 }} />
          </Box>
          <Skeleton variant="text" width="70%" height={20} />
        </Paper>

        {/* Alert Skeleton */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
        </Paper>

        {/* Form Skeleton */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            p: { xs: 2, sm: 3 },
          }}
        >
          {/* Basic Information Section */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              <Box>
                <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width={200} height={18} sx={{ mt: 0.5 }} />
              </Box>
              <Box>
                <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width={250} height={18} sx={{ mt: 0.5 }} />
              </Box>
              <Box>
                <Skeleton variant="text" width={90} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" width="100%" height={56} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width={220} height={18} sx={{ mt: 0.5 }} />
              </Box>
            </Stack>
          </Box>

          {/* Content Section */}
          <Box>
            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 3 }} />
            <Skeleton variant="rounded" width="100%" height={300} sx={{ borderRadius: 2 }} />
          </Box>

          {/* Toolbar Skeleton */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
            <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={80} height={40} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
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
                
                {/* Passes currentId to ensure correct validation */}
                <SlugInputWithValidation currentId={currentId} /> 
                
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
  );
};

export default PageEditFormLayout;