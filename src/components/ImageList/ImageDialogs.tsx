import React from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";
import ImageDetailsDialog from "./ImageDetailsDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import ImageContextMenu from "./ImageContextMenu";
import type { ImageGalleryLogic } from "./GridBodyLogic";

interface ImageDialogsProps {
  logic: ImageGalleryLogic;
}

const ImageDialogs: React.FC<ImageDialogsProps> = ({ logic }) => {
  const {
    previewImage,
    imageDetails,
    anchorEl,
    menuImage,
    editingFilename,
    tempFilename,
    deleteConfirmOpen,
    deleteTarget,
    filteredAndSortedData,
    
    navigateImage,
    setPreviewImage,
    setImageDetails,
    handleCopyUrl,
    handleDownload,
    handleMenuClose,
    startReplace,
    handleDelete,
    setEditingFilename,
    setTempFilename,
    handleFilenameEdit,
    confirmDelete,
  } = logic;
  
  const currentImageIndex = filteredAndSortedData.findIndex((img: any) => img.id === previewImage?.id);

  return (
    <>
      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={!!previewImage}
        image={previewImage}
        currentIndex={currentImageIndex}
        totalImages={filteredAndSortedData.length}
        onClose={() => setPreviewImage(null)}
        onNavigate={navigateImage}
        onCopyUrl={handleCopyUrl}
        onDownload={handleDownload}
        onShowDetails={(img) => {
          setImageDetails(img);
          setPreviewImage(null);
        }}
      />

      {/* Context Menu */}
      <ImageContextMenu
        anchorEl={anchorEl}
        image={menuImage}
        onClose={handleMenuClose}
        onCopyUrl={handleCopyUrl}
        onDownload={handleDownload}
        onReplace={startReplace}
        onShowDetails={(img) => {
            setImageDetails(img);
            handleMenuClose(); // Close menu when opening details
        }}
        onDelete={(img) => {
            handleDelete(img);
            handleMenuClose(); // Close menu when initiating delete
        }}
      />

      {/* Image Details Dialog */}
      <ImageDetailsDialog
        open={!!imageDetails}
        image={imageDetails}
        isEditing={editingFilename === imageDetails?.id}
        tempFilename={tempFilename}
        onClose={() => {
          setImageDetails(null);
          setEditingFilename(null);
        }}
        onStartEdit={(filename) => {
          if (imageDetails) {
            setEditingFilename(imageDetails.id);
            setTempFilename(filename);
          }
        }}
        onFilenameChange={setTempFilename}
        onSaveFilename={handleFilenameEdit}
        onCancelEdit={() => setEditingFilename(null)}
        onCopyUrl={handleCopyUrl}
        onReplace={startReplace}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        image={deleteTarget}
        onClose={() => handleDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ImageDialogs;