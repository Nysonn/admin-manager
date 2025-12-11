import { useCallback, useState } from "react";
import { useDataProvider, useNotify, useRefresh } from "react-admin";
import React from "react";

export type UploadItem = {
  id?: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploading: boolean;
  error?: string | null;
};

// Helper function
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

export const useImageUploadLogic = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // --- Utility Handlers ---

  const removeItem = (previewUrl: string) => {
    setItems((prev) => {
      // Revoke URL to prevent memory leaks
      prev.forEach((p) => {
        if (p.previewUrl === previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
      return prev.filter((p) => p.previewUrl !== previewUrl);
    });
  };
  
  // --- Main Upload Logic ---

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB

      // 1. Filter and notify of invalid files
      const validFiles = Array.from(files).filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= MAX_SIZE;
        
        if (!isValidType) {
          notify(`${file.name} is not a valid image file`, { type: "warning" });
        }
        if (!isValidSize) {
          notify(`${file.name} exceeds ${kb(MAX_SIZE)} limit`, { type: "warning" });
        }
        
        return isValidType && isValidSize;
      });

      if (validFiles.length === 0) return;

      const newUploads = validFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
        error: null,
      })) as UploadItem[];

      // 2. Add new items to state
      setItems((prev) => [...newUploads, ...prev]);

      let successCount = 0;
      let errorCount = 0;

      // 3. Process uploads sequentially
      for (const it of newUploads) {
        setItems((prev) => prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: true, progress: 50 } : p)));
        try {
          const record = {
            file: { rawFile: it.file }
          };

          await dataProvider.create("images", { data: record });

          setItems((prev) =>
            prev.map((p) =>
              p.previewUrl === it.previewUrl ? { ...p, uploading: false, progress: 100 } : p
            )
          );
          notify(`${it.file.name} uploaded successfully`, { type: "success" });
          successCount++;
          
          // Remove completed item after 2 seconds
          setTimeout(() => {
            removeItem(it.previewUrl);
          }, 2000);
        } catch (err: any) {
          setItems((prev) =>
            prev.map((p) => (p.previewUrl === it.previewUrl ? { ...p, uploading: false, error: err?.message ?? "Upload failed" } : p))
          );
          notify(`Upload failed: ${it.file.name}`, { type: "error" });
          errorCount++;
        }
      }

      // 4. Final Refresh
      if (successCount > 0) {
        refresh();
        notify(`Gallery refreshed - ${successCount} image${successCount !== 1 ? 's' : ''} added`, { 
          type: "info",
          autoHideDuration: 3000 
        });
      }
    },
    [dataProvider, notify, refresh]
  );
  
  // --- Drag/Drop Handlers ---

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input value so same file can be selected again
    e.currentTarget.value = "";
  };

  // Return values
  return {
    items,
    isDragging,
    kb, // Exporting helper for use in UI
    
    // UI Handlers
    onDragEnter,
    onDragLeave,
    onDrop,
    onBrowse,
    removeItem,
  };
};

export type ImageUploadLogic = ReturnType<typeof useImageUploadLogic>;