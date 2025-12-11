import { useState, useRef, useMemo } from "react";
import {
  useListContext,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import { useMediaQuery, useTheme } from "@mui/material";
import type { ImageRecord } from "./types";

export const useImageGalleryLogic = () => {
  const { data } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- State Management ---
  const [progressMap, setProgressMap] = useState<Record<number | string, number>>({});
  const [hoveredCard, setHoveredCard] = useState<number | string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number | string>>(new Set());
  const [previewImage, setPreviewImage] = useState<ImageRecord | null>(null);
  const [imageDetails, setImageDetails] = useState<ImageRecord | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuImage, setMenuImage] = useState<ImageRecord | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<Record<string, boolean>>({});
  const [editingFilename, setEditingFilename] = useState<number | string | null>(null);
  const [tempFilename, setTempFilename] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // --- Computed Values ---
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];
    // If filtering/sorting were re-added, they would go here.
    return data;
  }, [data]);

  const currentImageIndex = useMemo(() => {
    if (!previewImage || !filteredAndSortedData) return -1;
    return filteredAndSortedData.findIndex((img: ImageRecord) => img.id === previewImage.id);
  }, [previewImage, filteredAndSortedData]);

  // --- Handlers ---
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentImageIndex === -1) return;
    const newIndex = direction === 'prev' ? currentImageIndex - 1 : currentImageIndex + 1;
    if (newIndex >= 0 && newIndex < filteredAndSortedData.length) {
      setPreviewImage(filteredAndSortedData[newIndex]);
    }
  };

  const startReplace = (recordId: number | string) => {
    const input = inputRefs.current[String(recordId)];
    if (input) {
      input.click();
    }
  };

  const handleCopyUrl = (url: string, _filename: string, id?: string) => {
    navigator.clipboard.writeText(url);
    notify(`URL copied! ✓`, { type: "success" });
    if (id) {
      setCopyFeedback({ ...copyFeedback, [id]: true });
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Downloading ${filename}`, { type: "info" });
  };

  const handleReplaceFile = async (record: any, file?: File | null) => {
    if (!file) return;
    try {
      setProgressMap((p) => ({ ...p, [record.id]: 50 }));
      await dataProvider.update("images", { 
        id: record.id, 
        data: { file: { rawFile: file } }, 
        previousData: record 
      });
      notify(`Replaced ${record.filename}`, { type: "success" });
      setProgressMap((p) => ({ ...p, [record.id]: 100 }));
      refresh();
      setTimeout(() => setProgressMap((p) => ({ ...p, [record.id]: 0 })), 1000);
    } catch (err: any) {
      console.error("Replace failed", err);
      notify(`Replace failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
      setProgressMap((p) => ({ ...p, [record.id]: 0 }));
    }
  };

  const handleDelete = (record: any) => {
    setDeleteTarget(record);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await dataProvider.delete("images", { id: deleteTarget.id, previousData: deleteTarget });
      notify(`Image deleted successfully ✓`, { type: "success" });
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(deleteTarget.id);
        return newSet;
      });
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      setImageDetails(null);
      refresh();
    } catch (err: any) {
      console.error("Delete failed", err);
      notify(`Delete failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const handleFilenameEdit = async (record: any, newName: string) => {
    if (!newName || newName === record.filename) {
      setEditingFilename(null);
      return;
    }
    
    try {
      const updated = { ...record, filename: newName };
      await dataProvider.update("images", { 
        id: record.id, 
        data: updated, 
        previousData: record 
      });
      notify(`Filename updated ✓`, { type: "success" });
      setEditingFilename(null);
      if (imageDetails?.id === record.id) {
        setImageDetails(updated);
      }
      refresh();
    } catch (err: any) {
      notify(`Failed to update filename: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    const ok = window.confirm(`Delete ${selectedImages.size} images? This action cannot be undone.`);
    if (!ok) return;
    
    try {
      const deletePromises = Array.from(selectedImages).map(id => {
        const record = data?.find((r: any) => r.id === id);
        return dataProvider.delete("images", { id, previousData: record });
      });
      
      await Promise.all(deletePromises);
      notify(`Deleted ${selectedImages.size} images`, { type: "success" });
      setSelectedImages(new Set());
      refresh();
    } catch (err: any) {
      console.error("Bulk delete failed", err);
      notify(`Bulk delete failed: ${err?.message ?? "Unknown error"}`, { type: "error" });
    }
  };

  const toggleSelectImage = (id: number | string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    if (selectedImages.size === data?.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(data?.map((r: any) => r.id) || []));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, image: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuImage(image);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuImage(null);
  };
  
  // Return all states and handlers needed by the UI components
  return {
    // Data/Context
    data,
    filteredAndSortedData,
    isMobile,
    
    // State
    progressMap,
    hoveredCard,
    selectedImages,
    previewImage,
    imageDetails,
    anchorEl,
    menuImage,
    copyFeedback,
    editingFilename,
    tempFilename,
    deleteConfirmOpen,
    deleteTarget,
    
    // Refs
    inputRefs,

    // Handlers/Setters
    setHoveredCard,
    setSelectedImages,
    setPreviewImage,
    setImageDetails,
    setTempFilename,
    setEditingFilename,
    setDeleteConfirmOpen,
    setDeleteTarget,
    
    navigateImage,
    startReplace,
    handleCopyUrl,
    handleDownload,
    handleReplaceFile,
    handleDelete,
    confirmDelete,
    handleFilenameEdit,
    handleBulkDelete,
    toggleSelectImage,
    selectAllImages,
    handleMenuOpen,
    handleMenuClose,
  };
};

export type ImageGalleryLogic = ReturnType<typeof useImageGalleryLogic>;