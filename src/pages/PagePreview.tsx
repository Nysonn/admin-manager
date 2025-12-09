import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Box, 
  Paper, 
  Container,
  Fade,
  Button,
  Divider,
} from "@mui/material";
import PageLayout from "../components/Layout/PageLayout";
import dataProvider from "../providers/dataProvider";

// Import Child Components
import LoadingAndErrorStates from "../components/PagePreview/LoadingAndErrorStates";
import { PagePreviewHeader } from "../components/PagePreview/PagePreviewHeader";
import { PagePreviewMeta } from "../components/PagePreview/PagePreviewMeta";
import { PagePreviewContent } from "../components/PagePreview/PagePreviewContent";

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
  
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        let foundPage: PageData | undefined = undefined;

        // 1. Try to find by ID first (if it's a number)
        if (id && !isNaN(Number(id))) {
          try {
            const { data } = await dataProvider.getOne("pages", { id: Number(id) });
            foundPage = data as PageData;
          } catch (err) {
            // ID lookup failed, continue to slug lookup
          }
        }

        // 2. If not found by ID, try to find by slug
        if (!foundPage) {
          const { data: allPages } = await dataProvider.getList("pages", {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: "id", order: "ASC" },
            filter: {},
          });
          
          foundPage = allPages.find((p: any) => p.slug === id) as PageData;
        }
        
        if (foundPage) {
          setPage(foundPage);
        } else {
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

  // Handler for back button
  const handleGoBack = () => navigate(-1);
  // Handler for edit button
  const handleEdit = (pageId: number) => navigate(`/pages/${pageId}`);

  // --- Rendering based on state ---

  if (loading) {
    return <LoadingAndErrorStates state="loading" error={null} onGoBack={handleGoBack} />;
  }

  if (error || !page) {
    return <LoadingAndErrorStates state="error" error={error} onGoBack={handleGoBack} />;
  }

  // --- Success State Render ---
  return (
    <PageLayout>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ py: { xs: 3, sm: 5, md: 6 } }}>
            
            <PagePreviewHeader 
              pageId={page.id}
              status={page.status}
              onGoBack={handleGoBack}
              onEdit={handleEdit}
            />

            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* Header Section (Title & Meta) */}
              <PagePreviewMeta 
                title={page.title}
                createdAt={page.createdAt}
                updatedAt={page.updatedAt}
                status={page.status}
              />

              <Divider />

              {/* Content Section (HTML Rendering) */}
              <PagePreviewContent content={page.content} />
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