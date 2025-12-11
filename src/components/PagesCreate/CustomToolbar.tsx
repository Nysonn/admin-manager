import { Toolbar, SaveButton } from "react-admin";
import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Custom toolbar component with enhanced styling
interface CustomToolbarProps {
  [key: string]: unknown;
}

const CustomToolbar: React.FC<CustomToolbarProps> = (toolbarProps) => {
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
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon sx={{ fontSize: 20, color: 'info.main' }} />
        <Typography variant="body2" color="text.secondary">
          Fill in all required fields to save
        </Typography>
      </Box>
      <SaveButton 
        mutationOptions={{
          onSuccess: () => {
            // Will use the redirect from Create component
          }
        }}
        sx={{
          borderRadius: 2,
          px: 3,
          fontWeight: 600,
        }}
      />
    </Toolbar>
  );
};

export default CustomToolbar;