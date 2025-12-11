import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Fade,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import type { ImageUploadLogic } from "../../hooks/useImageUploadLogic"; 
import UploadItemCard from "./UploadItemCard"; 

interface ImageUploadItemRendererProps {
  logic: ImageUploadLogic;
}

const ImageUploadItemRenderer: React.FC<ImageUploadItemRendererProps> = ({ logic }) => {
  const { items, removeItem, kb } = logic;

  if (items.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 2,
          fontWeight: 700,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ImageIcon fontSize="small" />
        Uploading {items.length} {items.length === 1 ? 'image' : 'images'}
      </Typography>
      
      {/* Grid of Upload Cards */}
      <Grid container spacing={2}>
        {items.map((it, index) => (
          <Grid key={it.previewUrl} size={{xs:12, sm:6, md:4, lg:3}}>
            <Fade in timeout={300 + index * 100}>
              <UploadItemCard 
                item={it} 
                kb={kb} 
                removeItem={removeItem} 
                index={index}
              />
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageUploadItemRenderer;