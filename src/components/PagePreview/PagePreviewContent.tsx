import React from 'react';
import { Box } from "@mui/material";

interface PagePreviewContentProps {
  content: string;
}

export const PagePreviewContent: React.FC<PagePreviewContentProps> = ({ content }) => {
  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4, md: 6 },
        maxWidth: 900,
        mx: 'auto',
        // --- START: Extensive Content Styling ---
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
        // --- END: Extensive Content Styling ---
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};