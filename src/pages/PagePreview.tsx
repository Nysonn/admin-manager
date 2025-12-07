import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (error || !page) {
    return (
      <PageLayout>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            {error || "Page not found"}
          </Typography>
        </Paper>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {page.status === "draft" && (
        <Box
          sx={{
            bgcolor: "warning.light",
            color: "warning.contrastText",
            p: 1,
            mb: 3,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            Draft - Not Published
          </Typography>
        </Box>
      )}
      
      <Typography variant="h3" component="h1" gutterBottom>
        {page.title}
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 4 }}>
        Last updated: {new Date(page.updatedAt).toLocaleDateString()}
      </Typography>
      
      <Box
        sx={{
          "& p": { mb: 2, lineHeight: 1.7 },
          "& h1": { fontSize: "2.5rem", fontWeight: 600, mt: 4, mb: 2 },
          "& h2": { fontSize: "2rem", fontWeight: 600, mt: 3, mb: 2 },
          "& h3": { fontSize: "1.5rem", fontWeight: 600, mt: 3, mb: 2 },
          "& h4, & h5, & h6": { fontWeight: 600, mt: 2, mb: 1.5 },
          "& ul, & ol": { pl: 3, mb: 2, lineHeight: 1.7 },
          "& li": { mb: 0.5 },
          "& img": { maxWidth: "100%", height: "auto", borderRadius: 1, my: 2 },
          "& a": { color: "primary.main", textDecoration: "underline" },
          "& blockquote": { 
            borderLeft: "4px solid",
            borderColor: "primary.main",
            pl: 2,
            py: 1,
            my: 2,
            fontStyle: "italic",
            color: "text.secondary",
          },
          "& code": {
            bgcolor: "grey.100",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontFamily: "monospace",
            fontSize: "0.875rem",
          },
          "& pre": {
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
            my: 2,
          },
        }}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </PageLayout>
  );
};

export default PagePreview;
