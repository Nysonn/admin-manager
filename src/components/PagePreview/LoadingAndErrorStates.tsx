import React from 'react';
import { 
  Box, 
  Container, 
  Fade, 
  Paper, 
  Typography, 
  Skeleton, 
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import PageLayout from "../../components/Layout/PageLayout"; 

interface LoadingAndErrorStatesProps {
  state: 'loading' | 'error' | 'notfound';
  error: string | null;
  onGoBack: () => void;
}

const LoadingAndErrorStates: React.FC<LoadingAndErrorStatesProps> = ({ state, error, onGoBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (state === 'loading') {
    return (
      <PageLayout>
        <Container maxWidth="lg">
          <Box sx={{ py: { xs: 3, sm: 6 } }}>
            {/* Loading Skeleton */}
            <Skeleton 
              variant="rectangular" 
              height={40} 
              width="60%" 
              sx={{ borderRadius: 2, mb: 3 }} 
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Skeleton variant="rounded" width={100} height={32} />
              <Skeleton variant="rounded" width={150} height={32} />
            </Box>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Box>
        </Container>
      </PageLayout>
    );
  }
  
  // Error / Not Found State
  const displayError = error || "Page not found";
  const displayMessage = error 
    ? "An error occurred while loading the page."
    : "The page you're looking for doesn't exist or has been removed.";

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Fade in timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
              border: '1px solid',
              borderColor: 'error.light',
              my: { xs: 3, sm: 6 },
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(238, 90, 111, 0.3)',
              }}
            >
              <Typography variant="h2" sx={{ color: 'white' }}>!</Typography>
            </Box>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              color="error.dark"
              gutterBottom
              fontWeight={700}
            >
              {displayError}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}
            >
              {displayMessage}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />}
              onClick={onGoBack}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Go Back
            </Button>
          </Paper>
        </Fade>
      </Container>
    </PageLayout>
  );
};

export default LoadingAndErrorStates;