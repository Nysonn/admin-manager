/**
 * Shared types for ImageList components
 */

export interface ImageRecord {
  id: number | string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size: number;
  uploadedAt?: string;
}

export interface ImageCardProps {
  record: ImageRecord;
  progress: number;
  isHovered: boolean;
  isSelected: boolean;
  copyFeedback: boolean;
  onHover: (id: number | string | null) => void;
  onSelect: (id: number | string) => void;
  onPreview: (record: ImageRecord) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, record: ImageRecord) => void;
  onCopyUrl: (url: string, filename: string, id?: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  onReplaceFile: (record: ImageRecord, file?: File | null) => void;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onCancel: () => void;
}

export interface EmptyStateProps {
  isMobile: boolean;
}

export interface ImagePreviewDialogProps {
  open: boolean;
  image: ImageRecord | null;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onCopyUrl: (url: string, filename: string, id?: string) => void;
  onDownload: (url: string, filename: string) => void;
  onShowDetails: (image: ImageRecord) => void;
}

export interface ImageDetailsDialogProps {
  open: boolean;
  image: ImageRecord | null;
  isEditing: boolean;
  tempFilename: string;
  onClose: () => void;
  onStartEdit: (filename: string) => void;
  onFilenameChange: (filename: string) => void;
  onSaveFilename: (image: ImageRecord, filename: string) => void;
  onCancelEdit: () => void;
  onCopyUrl: (url: string, filename: string, id?: string) => void;
  onReplace: (id: number | string) => void;
  onDownload: (url: string, filename: string) => void;
  onDelete: (image: ImageRecord) => void;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  image: ImageRecord | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ImageContextMenuProps {
  anchorEl: HTMLElement | null;
  image: ImageRecord | null;
  onClose: () => void;
  onCopyUrl: (url: string, filename: string) => void;
  onDownload: (url: string, filename: string) => void;
  onReplace: (id: number | string) => void;
  onShowDetails: (image: ImageRecord) => void;
  onDelete: (image: ImageRecord) => void;
}

export interface GalleryHeaderProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  isMobile: boolean;
}
