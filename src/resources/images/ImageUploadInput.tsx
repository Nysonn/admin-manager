import React from "react";
import { Box } from "@mui/material";
import { useImageUploadLogic } from "../../hooks/useImageUploadLogic";
import ImageUploadDropZone from "../../components/ImageUploadInput/ImageUploadDropZone";
import ImageUploadItemRenderer from "../../components/ImageUploadInput/ImageUploadItemRenderer";

/**
 * ImageUploadInput Component
 * Combines the upload logic hook with dedicated UI components for the drop zone and upload queue.
 */
const ImageUploadInput: React.FC = () => {
  // 1. Initialize Logic Hook
  const logic = useImageUploadLogic();

  return (
    <Box>
      {/* 2. Render Drag-and-Drop/Browse Area */}
      <ImageUploadDropZone logic={logic} />

      {/* 3. Render Uploading/Completed/Failed Items */}
      <ImageUploadItemRenderer logic={logic} />
    </Box>
  );
};

export default ImageUploadInput;