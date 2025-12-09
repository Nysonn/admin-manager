import React from "react";
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { ArrowBack, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

interface MenuPreviewHeaderProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onGoBack: () => void;
}

export const MenuPreviewHeader: React.FC<MenuPreviewHeaderProps> = ({
  mobileOpen,
  handleDrawerToggle,
  onGoBack,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onGoBack}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Menu Preview
        </Typography>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};