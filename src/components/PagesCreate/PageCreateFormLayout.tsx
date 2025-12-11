import React from "react";
import {
  SimpleForm,
  TextInput,
  SelectInput,
} from "react-admin";
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Alert
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import RichTextInput from "../../components/RichTextInput/RichTextInput";
import CustomToolbar from "./CustomToolbar";
import SlugInputWithValidation from "./SlugInputWithValidation";

const statusChoices = [
  { id: "draft", name: "Draft" },
  { id: "published", name: "Published" },
];

const validateRequired = (v: string | undefined) => (v ? undefined : "Required");

const PageCreateFormLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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
                        Create New Page
                    </Typography>
                    <Chip
                        label="New"
                        color="primary"
                        size="small"
                        sx={{
                            fontWeight: 700,
                            height: 28,
                        }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Create a new page with rich content. Your page will be accessible via its unique slug URL.
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
                    • The slug is auto-generated from the title but can be customized
                    <br />
                    • Save as draft to continue editing later
                    <br />
                    • Publish when ready to make the page publicly visible
                </Typography>
            </Alert>

            {/* Main Form Container */}
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
                                    helperText="Enter a descriptive title for your page"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                                
                                <SlugInputWithValidation />
                                
                                <Box>
                                    <SelectInput 
                                        source="status" 
                                        choices={statusChoices} 
                                        defaultValue="draft"
                                        fullWidth
                                        helperText="Draft pages are not visible to the public"
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
                    After saving, you can preview your page or continue editing from the pages list
                </Typography>
            </Box>
        </Box>
    );
};

export default PageCreateFormLayout;