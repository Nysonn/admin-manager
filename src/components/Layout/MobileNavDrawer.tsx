import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface NavLink {
    label: string;
    href: string;
}

interface MobileNavDrawerProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  navLinks: NavLink[];
  currentPath: string;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  mobileMenuOpen,
  toggleMobileMenu,
  navLinks,
  currentPath,
}) => {
  return (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        "& .MuiDrawer-paper": {
          width: "280px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={toggleMobileMenu} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 2 }}>
        {navLinks.map((link) => (
          <ListItem
            key={link.href}
            component="a"
            href={link.href}
            sx={{
              mb: 1,
              borderRadius: "8px",
              backgroundColor: currentPath === link.href ? "rgba(255, 255, 255, 0.15)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemText
              primary={link.label}
              sx={{
                "& .MuiTypography-root": {
                  color: "white",
                  fontWeight: currentPath === link.href ? 600 : 400,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};