import { useState, useEffect } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { useAllMenuItems, useUpdateMenu, useAddMenuItem, useReorderMenuItems } from "./useMenu";
import { usePages } from "./usePages";
import type { MenuItem, AddMenuItemInput } from "../types";

export interface MenuManagementState {
  menuItems: MenuItem[] | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  pages: any[];
  localItems: MenuItem[];
  
  editDialogOpen: boolean;
  addDialogOpen: boolean;
  currentItem: MenuItem | null;
  formData: Partial<MenuItem>;
  snackbar: { open: boolean; message: string; severity: "success" | "error" | "info" | "warning" };
  
  updateMenuMutation: ReturnType<typeof useUpdateMenu>;
  addMenuItemMutation: ReturnType<typeof useAddMenuItem>;
  reorderMutation: ReturnType<typeof useReorderMenuItems>;
}

export interface MenuManagementActions {
  showSnackbar: (message: string, severity: "success" | "error" | "info" | "warning") => void;
  handleCloseSnackbar: () => void;
  setEditDialogOpen: (open: boolean) => void;
  setAddDialogOpen: (open: boolean) => void;
  setFormData: (data: Partial<MenuItem>) => void;
  
  handleEdit: (item: MenuItem) => void;
  handleAdd: () => void;
  handleSaveEdit: () => Promise<void>;
  handleSaveAdd: () => Promise<void>;
  handleDelete: (item: MenuItem) => Promise<void>;
  handleDragEnd: (result: DropResult) => Promise<void>;
  
  getPageTitle: (pageId?: number) => string;
  getUrl: (item: MenuItem) => string;
  refetch: () => void;
}


export const useMenuManagement = () => {
  const { data: menuItems, isLoading, error, refetch } = useAllMenuItems();
  const { data: pagesData } = usePages({ page: 1, perPage: 100 });
  const updateMenuMutation = useUpdateMenu();
  const addMenuItemMutation = useAddMenuItem();
  const reorderMutation = useReorderMenuItems();

  const pages = pagesData?.data || [];
  
  // --- Local State ---
  const [localItems, setLocalItems] = useState<MenuItem[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    label: "",
    linkType: "internal",
    pageId: undefined,
    url: "",
    icon: "",
    openInNewTab: false,
    showInMobile: true,
  });


  // --- Effects ---
  useEffect(() => {
    if (menuItems && Array.isArray(menuItems)) {
      setLocalItems(menuItems);
    }
  }, [menuItems]);

  // --- Utility Functions ---

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const getPageTitle = (pageId?: number) => {
    const page = pages.find((p) => p.id === pageId);
    return page ? page.title : "Unknown Page";
  };

  const getUrl = (item: MenuItem) => {
    if (item.linkType === "external") {
      return item.url || "";
    }
    if (item.linkType === "internal" && item.pageId) {
      const page = pages.find((p) => p.id === item.pageId);
      return page ? `/${page.slug}` : "";
    }
    return "";
  };
  
  // --- CRUD Handlers ---

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData(item);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({
      label: "",
      linkType: "internal",
      pageId: undefined,
      url: "",
      icon: "",
      openInNewTab: false,
      showInMobile: true,
    });
    setAddDialogOpen(true);
  };
  
  const extractErrorMessage = (error: any): string => {
    return error?.response?.data?.message || error?.message || "An unknown error occurred.";
  };

  const handleSaveEdit = async () => {
    if (!currentItem) return;
    if (!Array.isArray(localItems)) return;

    const updatedItems = localItems.map((item) =>
      item.id === currentItem.id ? { ...item, ...formData } : item
    );

    try {
      await updateMenuMutation.mutateAsync({
        id: 1,
        items: updatedItems,
      });
      setEditDialogOpen(false);
      showSnackbar(`Menu item "${formData.label}" updated successfully!`, "success");
    } catch (error: any) {
      showSnackbar(`Error: ${extractErrorMessage(error)}`, "error");
      console.error("Failed to update menu item:", error);
    }
  };

  const handleSaveAdd = async () => {
    if (!formData.label) {
      showSnackbar("Please enter a label for the menu item", "warning");
      return;
    }

    if (formData.linkType === "external" && !formData.url) {
      showSnackbar("Please enter a URL for the external link", "warning");
      return;
    }

    if (formData.linkType === "internal" && !formData.pageId) {
      showSnackbar("Please select a page for the internal link", "warning");
      return;
    }

    try {
      const response = await addMenuItemMutation.mutateAsync({
        id: 1,
        item: formData as AddMenuItemInput,
      });
      setAddDialogOpen(false);
      showSnackbar(`Menu item "${response.newItem.label}" added successfully!`, "success");
    } catch (error: any) {
      showSnackbar(`Error: ${extractErrorMessage(error)}`, "error");
      console.error("Failed to add menu item:", error);
    }
  };

  const handleDelete = async (item: MenuItem) => {
    if (!window.confirm(`Delete "${item.label}"?`)) return;
    if (!Array.isArray(localItems)) return;

    const updatedItems = localItems.filter((i) => i.id !== item.id);

    try {
      await updateMenuMutation.mutateAsync({
        id: 1,
        items: updatedItems,
      });
      showSnackbar(`Menu item "${item.label}" deleted successfully!`, "success");
    } catch (error: any) {
      showSnackbar(`Error: ${extractErrorMessage(error)}`, "error");
      console.error("Failed to delete menu item:", error);
    }
  };

  // --- Drag & Drop Handler ---

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (!Array.isArray(localItems) || localItems.length === 0) return;

    const items = Array.from(localItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic UI update
    setLocalItems(items);

    try {
      await reorderMutation.mutateAsync({
        id: 1,
        itemIds: items.map((item) => item.id),
      });
      showSnackbar("Menu items reordered successfully!", "success");
    } catch (error: any) {
      showSnackbar(`Error: ${extractErrorMessage(error)}`, "error");
      console.error("Failed to reorder menu items:", error);
      // Revert on error
      if (menuItems && Array.isArray(menuItems)) {
        setLocalItems(menuItems);
      }
    }
  };


  const state: MenuManagementState = {
    menuItems,
    isLoading,
    error,
    refetch,
    pages,
    localItems,
    editDialogOpen,
    addDialogOpen,
    currentItem,
    formData,
    snackbar,
    updateMenuMutation,
    addMenuItemMutation,
    reorderMutation,
  };

  const actions: MenuManagementActions = {
    showSnackbar,
    handleCloseSnackbar,
    setEditDialogOpen,
    setAddDialogOpen,
    setFormData,
    handleEdit,
    handleAdd,
    handleSaveEdit,
    handleSaveAdd,
    handleDelete,
    handleDragEnd,
    getPageTitle,
    getUrl,
    refetch,
  };

  return [state, actions] as const;
};

export type UseMenuManagement = ReturnType<typeof useMenuManagement>;