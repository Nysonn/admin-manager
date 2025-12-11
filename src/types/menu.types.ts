// Link type enum
export type LinkType = "internal" | "external" | "none";

// Snackbar state for notifications
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

// Page interface (imported from main types)
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemType {
  id: string;
  label: string;
  linkType: LinkType;
  pageId: number | null;
  url: string | null;
  icon: string | null;
  openInNewTab: boolean;
  showInMobile: boolean;
  children: MenuItemType[];
}

export const DEFAULT_NEW_ITEM = (): MenuItemType => ({
  id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  label: "New item",
  linkType: "none",
  pageId: null,
  url: null,
  icon: null,
  openInNewTab: false,
  showInMobile: true,
  children: [],
});