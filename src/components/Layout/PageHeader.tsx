import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

interface NavLink {
  label: string;
  href: string;
}

interface PageHeaderProps {
  navLinks: NavLink[];
  toggleMobileMenu: () => void;
  currentPath: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ navLinks, toggleMobileMenu, currentPath }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          Admin Manager
        </Typography>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {navLinks.map((link) => (
              <MuiLink
                key={link.href}
                href={link.href}
                underline="none"
                sx={{
                  position: "relative",
                  color: currentPath === link.href ? "#667eea" : "#4a5568",
                  fontWeight: currentPath === link.href ? 600 : 500,
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#667eea",
                    backgroundColor: "rgba(102, 126, 234, 0.08)",
                    transform: "translateY(-1px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: currentPath === link.href ? "60%" : "0%",
                    height: "2px",
                    backgroundColor: "#667eea",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "60%",
                  },
                }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            onClick={toggleMobileMenu}
            sx={{ 
              color: "#4a5568",
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.08)",
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};