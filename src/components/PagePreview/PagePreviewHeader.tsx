import React from 'react';
import { Box, Button, Fade, Paper, Typography } from "@mui/material";
import { ArrowBack, Edit, Visibility } from "@mui/icons-material";

interface PagePreviewHeaderProps {
  pageId: number;
  status: string;
  onGoBack: () => void;
  onEdit: (id: number) => void;
}

export const PagePreviewHeader: React.FC<PagePreviewHeaderProps> = ({ pageId, status, onGoBack, onEdit }) => {
  return (
    <>
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
          onClick={onGoBack}
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
            onClick={() => onEdit(pageId)}
            sx={{ borderRadius: 2 }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Status Badge */}
      {status === "draft" && (
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
    </>
  );
};