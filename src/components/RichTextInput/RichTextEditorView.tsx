import React from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
// import type { BoxProps } from '@mui/material';

interface RichTextEditorViewProps {
  editor: Editor;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  error?: { message?: string };
  label?: string;
  children?: React.ReactNode;
}

export const RichTextEditorView: React.FC<RichTextEditorViewProps> = ({
  editor,
  isFocused,
  setIsFocused,
  error,
  label,
  children,
}) => {
  const theme = useTheme();

  return (
    <>
      {label && (
        <Typography
          component="label"
          variant="subtitle2"
          sx={{
            display: 'block',
            mb: 1.5,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
          }}
        >
          {label}
        </Typography>
      )}
      <Paper
        elevation={isFocused ? 3 : 0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          border: error 
            ? '2px solid' 
            : isFocused 
            ? '2px solid' 
            : '1px solid',
          borderColor: error 
            ? 'error.main' 
            : isFocused 
            ? 'primary.main' 
            : 'divider',
          boxShadow: isFocused ? `0 0 0 3px ${theme.palette.primary.main}15` : 'none',
          '&:hover': {
            borderColor: error ? 'error.main' : 'primary.light',
            boxShadow: error ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
          },
        }}
      >
        {/* The Toolbar will be placed here in the parent component */}
        {children}
        
        <Box
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            minHeight: { xs: '180px', sm: '220px' },
            maxHeight: { xs: '400px', sm: '600px' },
            overflowY: 'auto',
            padding: { xs: 2, sm: 3 },
            backgroundColor: 'background.default',
            // Extensive Tiptap/ProseMirror styling applied here
            '& .ProseMirror': {
              outline: 'none',
              minHeight: { xs: '140px', sm: '180px' },
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              lineHeight: 1.7,
              color: 'text.primary',
              // ... (all the specific ProseMirror element styling remains here)
              '& p': { marginBottom: '1em' },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 600, marginTop: '1.5em', marginBottom: '0.75em', lineHeight: 1.3,
              },
              '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1em' },
              '& li': { marginBottom: '0.5em' },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: '1em',
                marginLeft: 0,
                fontStyle: 'italic',
                color: 'text.secondary',
                backgroundColor: 'action.hover',
                padding: '0.5em 1em',
                borderRadius: '0 4px 4px 0',
              },
              '& code': {
                backgroundColor: 'action.selected',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontSize: '0.9em',
                fontFamily: 'monospace',
              },
              '& pre': {
                backgroundColor: 'action.selected',
                padding: '1em',
                borderRadius: '4px',
                overflowX: 'auto',
                '& code': {
                  backgroundColor: 'transparent', padding: 0,
                },
              },
            },
            // Custom Scrollbar styling remains here
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { backgroundColor: 'action.hover' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'action.selected',
              borderRadius: '4px',
              '&:hover': { backgroundColor: 'action.disabled' },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
    </>
  );
};