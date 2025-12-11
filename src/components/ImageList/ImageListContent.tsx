import React from "react";
import { Datagrid, TextField, DateField } from "react-admin";
import {
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  alpha,
} from "@mui/material";
import ImageUploadInput from "../../resources/images/ImageUploadInput"; 
import GalleryHeader from "../../components/ImageList/GalleryHeader"; 
import ImageListGridBody from "./ImageListGridBody";

interface ImagesListContentProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

const ImagesListContent: React.FC<ImagesListContentProps> = ({ view, setView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
        {/* Gallery Header */}
        <GalleryHeader
          view={view}
          onViewChange={setView}
          isMobile={isMobile}
        />

        {/* Upload Zone */}
        <Box sx={{ mb: 3 }}>
          <ImageUploadInput />
        </Box>

        {/* Content Area */}
        {view === "grid" ? (
          <ImageListGridBody />
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              border: '1px solid', 
              borderColor: 'divider',
              boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
            }}
          >
            <Datagrid 
              rowClick="edit"
              sx={{
                '& .RaDatagrid-headerCell': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  fontWeight: 700,
                  // ... rest of the original styling ...
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  py: 2.5,
                },
                '& .RaDatagrid-row': {
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                },
                '& .RaDatagrid-rowCell': {
                  borderBottom: '1px solid',
                  borderColor: alpha('#000', 0.06),
                  py: 2,
                },
              }}
            >
              <TextField source="filename" />
              <TextField source="url" />
              <TextField source="size" label="Size (bytes)" />
              <DateField source="uploadedAt" showTime />
            </Datagrid>
          </Paper>
        )}
      </Box>
  );
};

export default ImagesListContent;