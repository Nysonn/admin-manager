import { useState, useEffect } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { useMenu, useUpdateMenu } from "../hooks/useMenu";
import { usePages } from "../hooks/usePages";
import type { MenuItemType, Page, SnackbarState } from '../types/menu.types';
import { DEFAULT_NEW_ITEM } from '../constants/menu.constants';
import {
  deepClone,
  removeItemById,
  insertItemAt,
  updateItemById,
  findItem,
} from '../utils/menuTree.utils';
import { parentIdFromDroppableId } from '../utils/droppable.utils';

export const useMenuBuilder = () => {
  const { data: menuData, isLoading: menuLoading, error: menuError, refetch } = useMenu(1);
  const { data: pagesData } = usePages({ page: 1, perPage: 100 });
  const updateMenuMutation = useUpdateMenu();

  const [originalMenu, setOriginalMenu] = useState<MenuItemType[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(menuItems) !== JSON.stringify(originalMenu));
  }, [menuItems, originalMenu]);

  // Load menu from API
  useEffect(() => {
    if (menuData) {
      const items = (menuData.items || []) as MenuItemType[];
      setOriginalMenu(deepClone(items));
      setMenuItems(deepClone(items));
    }
  }, [menuData]);

  // Load pages from API
  useEffect(() => {
    if (pagesData?.data) {
      setPages(pagesData.data as Page[]);
    }
  }, [pagesData]);

  /** Drag & Drop handling */
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const toParent = parentIdFromDroppableId(destination.droppableId);
    const toIndex = destination.index;

    // Remove draggable from source
    const removal = removeItemById(menuItems, draggableId);
    if (!removal.removed) return;

    // Insert into destination parent at toIndex
    const newTree = insertItemAt(removal.items, toParent, toIndex, removal.removed);
    setMenuItems(newTree);
  };

  /** Add new item at root */
  const addNewItem = () => {
    const newItem = DEFAULT_NEW_ITEM();
    setMenuItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  /** Add child to selected item */
  const addChildToSelected = () => {
    if (!selectedId) return;
    const newChild = DEFAULT_NEW_ITEM();
    const updated = updateItemById(menuItems, selectedId, (it) => {
      const children = it.children ? [...it.children, newChild] : [newChild];
      return { ...it, children };
    });
    setMenuItems(updated);
    setSelectedId(newChild.id);
  };

  /** Delete item */
  const deleteItem = (id: string) => {
    const ok = window.confirm("Delete this menu item and its children?");
    if (!ok) return;
    const result = removeItemById(menuItems, id);
    setMenuItems(result.items);
    if (selectedId === id) setSelectedId(null);
  };

  /** Update item form handler */
  const updateSelected = (patch: Partial<MenuItemType>) => {
    if (!selectedId) return;
    const updated = updateItemById(menuItems, selectedId, (it) => ({ ...it, ...patch }));
    setMenuItems(updated);
  };

  /** Save all changes */
  const saveAll = async () => {
    try {
      await updateMenuMutation.mutateAsync({
        id: 1,
        items: menuItems as any,
      });
      setOriginalMenu(deepClone(menuItems));
      showSnackbar("Menu saved successfully!", "success");
      refetch();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to save menu";
      showSnackbar(`Error: ${errorMessage}`, "error");
      console.error(err);
    }
  };

  /** Discard changes */
  const discard = () => {
    if (!originalMenu) return;
    const ok = window.confirm("Discard all changes? This cannot be undone.");
    if (!ok) return;
    setMenuItems(deepClone(originalMenu));
    setSelectedId(null);
    showSnackbar("Changes discarded", "info");
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectedItem = selectedId ? findItem(menuItems, selectedId) : null;

  return {
    // State
    menuItems,
    selectedId,
    selectedItem,
    expandedItems,
    hasUnsavedChanges,
    pages,
    snackbar,
    
    // Loading/Error
    isLoading: menuLoading,
    error: menuError,
    
    // Actions
    onDragEnd,
    addNewItem,
    addChildToSelected,
    deleteItem,
    updateSelected,
    saveAll,
    discard,
    toggleExpand,
    setSelectedId,
    showSnackbar,
    handleCloseSnackbar,
  };
};