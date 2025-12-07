import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { ErrorOutline, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 6,
              borderRadius: 2,
              backgroundColor: "background.paper",
              width: "100%",
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 120,
                color: "primary.main",
                mb: 2,
              }}
            />
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4rem", md: "6rem" },
                fontWeight: 700,
                color: "primary.main",
                mb: 2,
              }}
            >
              404
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "text.primary",
              }}
            >
              Page Not Found
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or doesn't exist.
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate("/")}
                sx={{ textTransform: "none", px: 4 }}
              >
                Go to Homepage
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(-1)}
                sx={{ textTransform: "none", px: 4 }}
              >
                Go Back
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </PageLayout>
  );
};

export default NotFound;
