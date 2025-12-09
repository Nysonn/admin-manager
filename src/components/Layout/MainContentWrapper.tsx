import React from 'react';
import { Box, Container } from "@mui/material";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children }) => {
  return (
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
  );
};