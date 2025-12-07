import React from "react";
import { Box, Container, Typography, AppBar, Toolbar, Link as MuiLink } from "@mui/material";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Homepage
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink href="/" color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              Home
            </MuiLink>
            <MuiLink href="/about" color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              About
            </MuiLink>
            <MuiLink href="/contact" color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              Contact
            </MuiLink>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Admin Manager. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <MuiLink href="/privacy" color="text.secondary" underline="hover" sx={{ cursor: "pointer" }}>
                Privacy Policy
              </MuiLink>
              <MuiLink href="/terms" color="text.secondary" underline="hover" sx={{ cursor: "pointer" }}>
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
