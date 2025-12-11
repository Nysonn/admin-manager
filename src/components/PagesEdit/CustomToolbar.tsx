import React from "react";
import { Toolbar, SaveButton, useRecordContext } from "react-admin";
import { 
  Button, 
  Box, 
  Typography, 
} from "@mui/material";
import { 
  Visibility as VisibilityIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// Custom toolbar component with enhanced styling
interface CustomToolbarProps {
  [key: string]: unknown;
}

const CustomToolbar: React.FC<CustomToolbarProps> = (toolbarProps) => {
  const record = useRecordContext();

  // Guard against missing record (e.g., during initial load)
  if (!record) {
    return <Toolbar {...toolbarProps} />;
  }

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
            // Assuming a standard preview route based on slug
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

export default CustomToolbar;