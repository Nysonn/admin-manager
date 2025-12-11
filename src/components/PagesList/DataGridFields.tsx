import React from "react";
import { 
  useRecordContext, 
  EditButton, 
  DeleteButton,
} from "react-admin";
import { 
  Chip, 
  Link, 
  Box,
  IconButton,
  Tooltip,
  Stack,
  alpha,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";

// --- 1. Status Chip ---
export const StatusField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const isPublished = record.status === "published";
  
  return (
    <Chip 
      label={isPublished ? "Published" : "Draft"} 
      size="small" 
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: 1.5,
        backgroundColor: isPublished ? 'success.main' : alpha('#000', 0.08),
        color: isPublished ? 'white' : 'text.secondary',
        minWidth: 90,
        height: 24,
        transition: 'transform 0.15s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '& .MuiChip-label': {
          px: 1.75,
          py: 0.25,
        },
      }}
    />
  );
};

// --- 2. Clickable Title Link ---
export const TitleLinkField: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const slug = record.slug ?? record.id;
    // Note: Adjust `/preview/` route to match your actual frontend preview path
    window.open(`/preview/${slug}`, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <ArticleIcon sx={{ 
        fontSize: 20, 
        color: alpha('#1976d2', 0.6),
        transition: 'color 0.2s ease',
      }} />
      <Link
        href="#"
        onClick={handleClick}
        sx={{ 
          color: "primary.main",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: '0.9375rem',
          transition: 'all 0.2s ease',
          "&:hover": { 
            color: "primary.dark",
            textDecoration: "underline",
            textDecorationThickness: 2,
          },
          cursor: "pointer"
        }}
      >
        {record.title}
      </Link>
    </Box>
  );
};

// --- 3. Custom Action Buttons ---
export const ActionButtons: React.FC = () => {
  const record = useRecordContext();
  if (!record) return null;

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = record.slug ?? record.id;
    window.open(`/preview/${slug}`, '_blank');
  };

  return (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Preview page" arrow placement="top">
        <IconButton
          size="small"
          onClick={handlePreview}
          sx={{
            color: 'info.main',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha('#0288d1', 0.12),
              transform: 'scale(1.1)',
            },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit page" arrow placement="top">
        <Box component="span">
          <EditButton 
            icon={<EditIcon fontSize="small" />}
            label=""
            record={record} // Ensure EditButton gets the record if rowClick is false
            sx={{
              minWidth: 'auto',
              p: 0.75,
              color: 'primary.main',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#1976d2', 0.12),
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
      </Tooltip>
      <Tooltip title="Delete page" arrow placement="top">
        <Box component="span">
          <DeleteButton 
            icon={<DeleteIcon fontSize="small" />}
            label=""
            record={record} // Ensure DeleteButton gets the record
            sx={{
              minWidth: 'auto',
              p: 0.75,
              color: 'error.main',
              borderRadius: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#d32f2f', 0.12),
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
      </Tooltip>
    </Stack>
  );
};