import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Box, 
  Paper, 
  Chip,
  Container,
  Fade,
  Skeleton,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { 
  AccessTime, 
  CalendarToday, 
  ArrowBack,
  Visibility,
  Edit,
} from "@mui/icons-material";
import PageLayout from "../components/PageLayout";
import dataProvider from "../providers/dataProvider";

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PagePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to find by ID first (if it's a number)
        if (id && !isNaN(Number(id))) {
          try {
            const { data } = await dataProvider.getOne("pages", { id: Number(id) });
            setPage(data as PageData);
            return;
          } catch (err) {
            console.log("Not found by ID, trying slug...");
          }
        }

        // Try to find by slug - get all pages and filter client-side
        const { data: allPages } = await dataProvider.getList("pages", {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        });
        
        // Find page by slug
        const matchingPage = allPages.find((p: any) => p.slug === id);
        
        if (matchingPage) {
          setPage(matchingPage as PageData);
        } else {
          console.error("Page not found. Available slugs:", allPages.map((p: any) => p.slug));
          setError("Page not found");
        }
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPage();
    }
  }, [id]);

  if (loading) {
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

  if (error || !page) {
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
                {error || "Page not found"}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}
              >
                The page you're looking for doesn't exist or has been removed.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
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
  }

  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ py: { xs: 3, sm: 5, md: 6 } }}>
            {/* Back Button & Actions Bar */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Button 
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  size="small"
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => navigate(`/pages/${page.id}`)}
                  sx={{ borderRadius: 2 }}
                >
                  Edit
                </Button>
              </Box>
            </Box>

            {/* Status Badge */}
            {page.status === "draft" && (
              <Fade in timeout={600}>
                <Paper
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%)',
                    border: '1px solid',
                    borderColor: 'warning.light',
                    borderRadius: 2,
                    p: 2,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Visibility sx={{ color: 'warning.main' }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="warning.dark">
                      Draft Mode
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This page is not visible to the public yet
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
            
            {/* Main Content Paper */}
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Header Section */}
              <Box
                sx={{
                  background: '#667eea',
                  p: { xs: 3, sm: 4, md: 5 },
                  color: 'white',
                }}
              >
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  {page.title}
                </Typography>
                
                {/* Meta Information */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: { xs: 1.5, sm: 3 },
                    alignItems: 'center',
                  }}
                >
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: '1rem !important' }} />}
                    label={`Created: ${new Date(page.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}`}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Chip
                    icon={<AccessTime sx={{ fontSize: '1rem !important' }} />}
                    label={`Updated: ${new Date(page.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}`}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Chip
                    label={page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: page.status === 'published' 
                        ? 'rgba(76, 175, 80, 0.9)' 
                        : 'rgba(255, 152, 0, 0.9)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Content Section */}
              <Box
                sx={{
                  p: { xs: 3, sm: 4, md: 6 },
                  maxWidth: 900,
                  mx: 'auto',
                  "& p": { 
                    mb: 2.5, 
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', sm: '1.0625rem' },
                    color: 'text.primary',
                  },
                  "& h1": { 
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 700, 
                    mt: 5, 
                    mb: 2.5,
                    color: 'text.primary',
                    lineHeight: 1.3,
                  },
                  "& h2": { 
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                    fontWeight: 700, 
                    mt: 4, 
                    mb: 2,
                    color: 'text.primary',
                    lineHeight: 1.3,
                  },
                  "& h3": { 
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    fontWeight: 600, 
                    mt: 4, 
                    mb: 2,
                    color: 'text.primary',
                    lineHeight: 1.4,
                  },
                  "& h4, & h5, & h6": { 
                    fontWeight: 600, 
                    mt: 3, 
                    mb: 1.5,
                    color: 'text.primary',
                  },
                  "& ul, & ol": { 
                    pl: { xs: 2.5, sm: 3.5 },
                    mb: 2.5, 
                    lineHeight: 1.8,
                  },
                  "& li": { 
                    mb: 1,
                    fontSize: { xs: '1rem', sm: '1.0625rem' },
                  },
                  "& img": { 
                    maxWidth: "100%", 
                    height: "auto", 
                    borderRadius: 2,
                    my: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                  },
                  "& a": { 
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    borderBottom: '2px solid',
                    borderColor: 'primary.light',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.dark',
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.lighter',
                    },
                  },
                  "& blockquote": { 
                    borderLeft: "5px solid",
                    borderColor: "primary.main",
                    pl: 3,
                    pr: 2,
                    py: 2,
                    my: 3,
                    fontStyle: "italic",
                    fontSize: { xs: '1.0625rem', sm: '1.125rem' },
                    color: "text.secondary",
                    backgroundColor: 'action.hover',
                    borderRadius: '0 8px 8px 0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  },
                  "& code": {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    color: '#d63384',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  },
                  "& pre": {
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    overflow: "auto",
                    my: 3,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '& code': {
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      padding: 0,
                      border: 'none',
                    },
                  },
                  "& table": {
                    width: '100%',
                    borderCollapse: 'collapse',
                    my: 3,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  },
                  "& th, & td": {
                    padding: { xs: 1.5, sm: 2 },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'left',
                  },
                  "& th": {
                    backgroundColor: 'action.hover',
                    fontWeight: 600,
                    color: 'text.primary',
                  },
                  "& tr:hover": {
                    backgroundColor: 'action.hover',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </Paper>

            {/* Footer Section */}
            <Box 
              sx={{ 
                mt: 4, 
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Page ID: <strong>{page.slug}</strong>
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ borderRadius: 2 }}
              >
                Back to Top
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </PageLayout>
  );
};

export default PagePreview;
