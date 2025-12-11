import React from "react";
import { TopToolbar, CreateButton } from "react-admin";
import { useTheme, useMediaQuery, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

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
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
        }}
      />
    </TopToolbar>
  );
};

export default ListActions;