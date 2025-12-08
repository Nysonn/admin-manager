import React, { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Link as MuiLink,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentPath = window.location.pathname;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
      }}
    >
      {/* Enhanced Header with Glassmorphism */}
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

      {/* Mobile Drawer */}
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

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: { xs: 3, md: 5 },
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              minHeight: "400px",
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>

      {/* Enhanced Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#4a5568",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                © {new Date().getFullYear()} Admin Manager
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#718096",
                }}
              >
                All rights reserved.
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: "flex", 
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <MuiLink 
                href="/privacy" 
                underline="none"
                sx={{ 
                  color: "#718096",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#667eea",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink 
                href="/terms" 
                underline="none"
                sx={{ 
                  color: "#718096",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#667eea",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                Terms of Service
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PageLayout;