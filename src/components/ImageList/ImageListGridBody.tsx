import React from "react";
import Grid from "@mui/material/Grid";
import { useListContext } from "react-admin";
import { useImageGalleryLogic } from "./GridBodyLogic";
import BulkActionsBar from "./BulkActionsBar";
import EmptyState from "./EmptyState";
import ImageCard from "./ImageCard"; 
import ImageDialogs from "./ImageDialogs";

interface ImageListGridBodyProps {}

const ImageListGridBody: React.FC<ImageListGridBodyProps> = () => {
  const { data } = useListContext();
  const logic = useImageGalleryLogic();

  const {
    filteredAndSortedData,
    isMobile,
    progressMap,
    hoveredCard,
    selectedImages,
    copyFeedback,
    inputRefs,
    
    setHoveredCard,
    toggleSelectImage,
    setPreviewImage,
    handleMenuOpen,
    handleCopyUrl,
    handleReplaceFile,
    handleBulkDelete,
    selectAllImages,
    setSelectedImages,
  } = logic;

  // Empty states
  if (!data || data.length === 0) {
    return <EmptyState isMobile={isMobile} />;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedImages.size}
        totalCount={data?.length || 0}
        allSelected={selectedImages.size === data?.length}
        onSelectAll={selectAllImages}
        onBulkDelete={handleBulkDelete}
        onCancel={() => setSelectedImages(new Set())}
      />

      {/* Professional Image Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        {filteredAndSortedData?.map((record: any) => {
          if (!record) return null;
          const progress = progressMap[record.id] ?? 0;
          const isHovered = hoveredCard === record.id;
          const isSelected = selectedImages.has(record.id);

          return (
            <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ImageCard
                record={record}
                progress={progress}
                isHovered={isHovered}
                isSelected={isSelected}
                copyFeedback={copyFeedback[record.id] || false}
                onHover={setHoveredCard}
                onSelect={toggleSelectImage}
                onPreview={setPreviewImage}
                onMenuOpen={handleMenuOpen}
                onCopyUrl={handleCopyUrl}
                inputRef={(el) => {
                  inputRefs.current[String(record.id)] = el;
                }}
                onReplaceFile={handleReplaceFile}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Dialogs and Menu (Moved to a separate component) */}
      <ImageDialogs logic={logic} />
    </>
  );
};

export default ImageListGridBody;