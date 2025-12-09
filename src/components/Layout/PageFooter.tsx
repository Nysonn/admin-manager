import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export const PageFooter: React.FC = () => {
  return (
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
  );
};