import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Divider,
  TextField,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Tooltip,
  Zoom,
  alpha,
  useTheme,
  useMediaQuery,
  Collapse,
  Alert,
  Badge,
  Stack,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import PreviewIcon from "@mui/icons-material/Preview";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDataProvider, useNotify, useRefresh } from "react-admin";
import { useNavigate } from "react-router-dom";

type LinkType = "internal" | "external" | "none";

export type MenuItemType = {
  id: string;
  label: string;
  linkType: LinkType;
  pageId?: number | null;
  url?: string | null;
  icon?: string | null;
  openInNewTab?: boolean;
  showInMobile?: boolean;
  children?: MenuItemType[];
};

const DEFAULT_NEW_ITEM = (): MenuItemType => ({
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

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

// Helpers to manipulate a tree of MenuItemType

/** Find and remove an item by id; returns [removedItem, newTree] */
function removeItemById(items: MenuItemType[], id: string): { removed?: MenuItemType; items: MenuItemType[] } {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      const removed = items[i];
      const newItems = [...items.slice(0, i), ...items.slice(i + 1)];
      return { removed, items: newItems };
    }
    if (items[i].children && items[i].children!.length) {
      const result = removeItemById(items[i].children!, id);
      if (result.removed) {
        const newParent = { ...items[i], children: result.items };
        const newItems = [...items.slice(0, i), newParent, ...items.slice(i + 1)];
        return { removed: result.removed, items: newItems };
      }
    }
  }
  return { items };
}

/** Insert an item into targetParentId's children at index. If parentId === "root", insert into root array. */
function insertItemAt(items: MenuItemType[], parentId: string | "root", index: number, item: MenuItemType): MenuItemType[] {
  if (parentId === "root") {
    const copy = [...items];
    copy.splice(index, 0, item);
    return copy;
  }
  // recursive search to find parent
  const newItems = items.map((it) => {
    if (it.id === parentId) {
      const children = it.children ? [...it.children] : [];
      children.splice(index, 0, item);
      return { ...it, children };
    }
    if (it.children && it.children.length) {
      return { ...it, children: insertItemAt(it.children, parentId, index, item) };
    }
    return it;
  });
  return newItems;
}

/** Find and update an item by id with updater function */
function updateItemById(items: MenuItemType[], id: string, updater: (item: MenuItemType) => MenuItemType): MenuItemType[] {
  return items.map((it) => {
    if (it.id === id) {
      return updater(it);
    }
    if (it.children && it.children.length) {
      return { ...it, children: updateItemById(it.children, id, updater) };
    }
    return it;
  });
}

/** Render helpers */

/** Helper to get droppableId for a given parent path. We encode as 'root' or 'parent-{id}' */
const droppableIdFor = (parentId: string | "root") => (parentId === "root" ? "root" : `parent-${parentId}`);

/** Helper to decode droppableId back to parentId */
const parentIdFromDroppableId = (droppableId: string): string | "root" =>
  droppableId === "root" ? "root" : droppableId.replace(/^parent-/, "");

/**
 * MenuBuilder Component
 */
const MenuBuilder: React.FC = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [originalMenu, setOriginalMenu] = useState<MenuItemType[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pages, setPages] = useState<{ id: number; title: string }[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(menuItems) !== JSON.stringify(originalMenu));
  }, [menuItems, originalMenu]);

  // Load menu (single record id=1) and pages for internal links
  useEffect(() => {
    (async () => {
      try {
        const menuRes = await dataProvider.getOne("menu", { id: 1 });
        const items: MenuItemType[] = menuRes?.data?.items ? menuRes.data.items : [];
        setOriginalMenu(deepClone(items));
        setMenuItems(deepClone(items));
      } catch (err) {
        setOriginalMenu([]);
        setMenuItems([]);
      }
      try {
        const pagesRes = await dataProvider.getList("pages", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "id", order: "ASC" },
          filter: {},
        });
        setPages((pagesRes.data || []).map((p: any) => ({ id: p.id, title: p.title })));
      } catch (e) {
        setPages([]);
      }
    })();
  }, [dataProvider]);

  // Utility: find an item by id
  const findItem = (items: MenuItemType[], id: string): MenuItemType | undefined => {
    for (const it of items) {
      if (it.id === id) return it;
      if (it.children && it.children.length) {
        const found = findItem(it.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  /** Drag & Drop handling */
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const toParent = parentIdFromDroppableId(destination.droppableId);
    const toIndex = destination.index;

    // Remove draggable from source
    const removal = removeItemById(menuItems, draggableId);
    if (!removal.removed) return; // nothing removed (shouldn't happen)

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

  /** Save all changes (persist whole menu JSON as single record id=1) */
  const saveAll = async () => {
    try {
      await dataProvider.update("menu", {
        id: 1, data: { id: 1, items: menuItems },
        previousData: undefined
      });
      setOriginalMenu(deepClone(menuItems));
      notify("Menu saved", { type: "info" });
      refresh();
    } catch (err: any) {
      console.error(err);
      notify("Failed to save menu", { type: "warning" });
    }
  };

  /** Discard changes (revert to originalMenu) */
  const discard = () => {
    if (!originalMenu) return;
    const ok = window.confirm("Discard all changes? This cannot be undone.");
    if (!ok) return;
    setMenuItems(deepClone(originalMenu));
    setSelectedId(null);
    notify("Changes discarded", { type: "info" });
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

  const getLinkIcon = (linkType: LinkType) => {
    switch (linkType) {
      case 'internal': return <DescriptionIcon fontSize="small" />;
      case 'external': return <LanguageIcon fontSize="small" />;
      default: return <FolderIcon fontSize="small" />;
    }
  };

  /** Render recursive list as Droppable groups */
  const renderList = (items: MenuItemType[], parentId: string | "root" = "root", level = 0) => {
    const droppableId = droppableIdFor(parentId);
    return (
      <Droppable droppableId={droppableId} type="MENU" isDropDisabled={false}>
        {(provided, droppableSnapshot) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            style={{
              backgroundColor: droppableSnapshot.isDraggingOver 
                ? alpha(theme.palette.primary.main, 0.05)
                : 'transparent',
              borderRadius: 8,
              padding: droppableSnapshot.isDraggingOver ? 8 : 0,
              transition: 'all 0.2s ease',
              minHeight: items.length === 0 ? 60 : 'auto',
            }}
          >
            {items.map((it, index) => {
              const hasChildren = it.children && it.children.length > 0;
              const isExpanded = expandedItems.has(it.id);
              const isSelected = selectedId === it.id;

              return (
                <Draggable draggableId={it.id} index={index} key={it.id}>
                  {(dragProvided, snapshot) => (
                    <Box
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      sx={{
                        userSelect: "none",
                        mb: 1.5,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: snapshot.isDragging 
                          ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                          : isSelected
                          ? `0 0 0 2px ${theme.palette.primary.main}`
                          : '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid',
                        borderColor: snapshot.isDragging 
                          ? 'primary.main'
                          : isSelected 
                          ? 'primary.main'
                          : 'divider',
                        backgroundColor: snapshot.isDragging 
                          ? alpha(theme.palette.primary.main, 0.08)
                          : isSelected
                          ? alpha(theme.palette.primary.main, 0.04)
                          : 'background.paper',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                        ...dragProvided.draggableProps.style,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          gap: 1.5,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        {/* Drag handle */}
                        <Tooltip title="Drag to reorder" arrow TransitionComponent={Zoom}>
                          <Box 
                            {...dragProvided.dragHandleProps} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'grab',
                              color: 'text.secondary',
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <DragIndicatorIcon />
                          </Box>
                        </Tooltip>

                        {/* Expand/Collapse button for items with children */}
                        {hasChildren ? (
                          <Tooltip title={isExpanded ? "Collapse" : "Expand"} arrow>
                            <IconButton
                              size="small"
                              onClick={() => toggleExpand(it.id)}
                              sx={{
                                width: 28,
                                height: 28,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              {isExpanded ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Box sx={{ width: 28 }} /> // Spacer
                        )}

                        {/* Link type icon */}
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(
                              it.linkType === 'internal' 
                                ? theme.palette.primary.main
                                : it.linkType === 'external'
                                ? theme.palette.info.main
                                : theme.palette.grey[500],
                              0.15
                            ),
                            color: it.linkType === 'internal' 
                              ? 'primary.main'
                              : it.linkType === 'external'
                              ? 'info.main'
                              : 'text.secondary',
                          }}
                        >
                          {getLinkIcon(it.linkType)}
                        </Box>

                        {/* Main content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="subtitle2" 
                              noWrap
                              fontWeight={600}
                              sx={{ color: 'text.primary' }}
                            >
                              {it.label}
                            </Typography>
                            {it.openInNewTab && (
                              <Tooltip title="Opens in new tab" arrow>
                                <OpenInNewIcon 
                                  sx={{ 
                                    fontSize: 14, 
                                    color: 'text.secondary',
                                  }} 
                                />
                              </Tooltip>
                            )}
                            {it.showInMobile && (
                              <Tooltip title="Visible on mobile" arrow>
                                <SmartphoneIcon 
                                  sx={{ 
                                    fontSize: 14, 
                                    color: 'success.main',
                                  }} 
                                />
                              </Tooltip>
                            )}
                            {hasChildren && (
                              <Chip
                                label={`${it.children!.length}`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            noWrap
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            {it.linkType === "internal" ? (
                              <>
                                <LinkIcon sx={{ fontSize: 12 }} />
                                Page: {pages.find(p => p.id === it.pageId)?.title || `#${it.pageId}` || "(none)"}
                              </>
                            ) : it.linkType === "external" ? (
                              <>
                                <LinkIcon sx={{ fontSize: 12 }} />
                                {it.url || "(no URL)"}
                              </>
                            ) : (
                              "No link (parent item)"
                            )}
                          </Typography>
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
                            <IconButton
                              size="small"
                              onClick={() => setSelectedId(it.id)}
                              sx={{
                                backgroundColor: isSelected 
                                  ? 'primary.main'
                                  : alpha(theme.palette.primary.main, 0.1),
                                color: isSelected ? 'white' : 'primary.main',
                                '&:hover': {
                                  backgroundColor: isSelected
                                    ? 'primary.dark'
                                    : alpha(theme.palette.primary.main, 0.2),
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                            <IconButton
                              size="small"
                              onClick={() => deleteItem(it.id)}
                              sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'error.main',
                                  color: 'white',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>

                      {/* Render children recursively, collapsed/expanded */}
                      {hasChildren && (
                        <Collapse in={isExpanded} timeout="auto">
                          <Box 
                            sx={{ 
                              ml: { xs: 3, sm: 6 },
                              mr: 1.5,
                              mb: 1.5,
                              pl: 2,
                              borderLeft: '2px solid',
                              borderColor: 'divider',
                            }}
                          >
                            {renderList(it.children!, it.id, level + 1)}
                          </Box>
                        </Collapse>
                      )}
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            {items.length === 0 && level === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <FolderIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: 'text.disabled',
                    mb: 1,
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  No menu items yet. Click "Add Menu Item" to get started.
                </Typography>
              </Paper>
            )}
          </div>
        )}
      </Droppable>
    );
  };

  const selectedItem = selectedId ? findItem(menuItems, selectedId) : null;

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Box sx={{ position: 'fixed', top: 80, right: 24, zIndex: 1000 }}>
          <Alert 
            severity="warning"
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
            }}
          >
            You have unsaved changes
          </Alert>
        </Box>
      )}

      {/* Left panel: Menu editor */}
      <Paper 
        elevation={0}
        sx={{ 
          width: isMobile ? '100%' : '60%',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              mb: 2,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{
                  color: 'primary.main',
                  mb: 0.5,
                }}
              >
                Menu Editor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag items to reorder • Click to edit
              </Typography>
            </Box>
            <Badge 
              badgeContent={menuItems.length} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  height: 24,
                  minWidth: 24,
                  borderRadius: 12,
                },
              }}
            >
              <Box />
            </Badge>
          </Box>

          <Stack direction={isMobile ? "column" : "row"} spacing={1.5}>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained" 
              onClick={addNewItem}
              fullWidth={isMobile}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add Menu Item
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              variant="outlined" 
              onClick={addChildToSelected} 
              disabled={!selectedId}
              fullWidth={isMobile}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Add Child
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* DragDropContext wraps the nested droppables */}
        <Box sx={{ minHeight: 300 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {renderList(menuItems, "root")}
          </DragDropContext>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={1.5}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button 
            variant="outlined" 
            startIcon={<UndoIcon />} 
            onClick={discard}
            disabled={!hasUnsavedChanges}
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Discard Changes
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={saveAll}
            disabled={!hasUnsavedChanges}
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              transition: 'all 0.3s ease',
            }}
          >
            Save All Changes
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<PreviewIcon />}
            onClick={() => navigate("/menu-preview")}
            fullWidth={isMobile}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Preview Menu
          </Button>
        </Stack>
      </Paper>

      {/* Right panel: Item editor */}
      <Paper 
        elevation={0}
        sx={{ 
          width: isMobile ? '100%' : '40%',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
          height: 'fit-content',
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 0 : 100,
        }}
      >
        <Typography 
          variant="h6" 
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Item Editor
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {selectedItem ? `Editing: ${selectedItem.label}` : 'Select an item to edit'}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {!selectedItem ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <EditIcon 
              sx={{ 
                fontSize: 56, 
                color: 'text.disabled',
                mb: 2,
              }} 
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              No item selected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click on a menu item in the editor to configure its properties
            </Typography>
          </Paper>
        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Label"
              value={selectedItem.label}
              onChange={(e) => updateSelected({ label: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="link-type-label">Link Type</InputLabel>
              <Select
                labelId="link-type-label"
                value={selectedItem.linkType}
                label="Link Type"
                onChange={(e) => updateSelected({ linkType: e.target.value as LinkType })}
                sx={{ borderRadius: 2 }}
              >
                <MuiMenuItem value="internal">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon fontSize="small" />
                    Internal Page
                  </Box>
                </MuiMenuItem>
                <MuiMenuItem value="external">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon fontSize="small" />
                    External URL
                  </Box>
                </MuiMenuItem>
                <MuiMenuItem value="none">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon fontSize="small" />
                    No Link (Parent)
                  </Box>
                </MuiMenuItem>
              </Select>
            </FormControl>

            {selectedItem.linkType === "internal" && (
              <FormControl fullWidth>
                <InputLabel id="page-select-label">Page</InputLabel>
                <Select
                  labelId="page-select-label"
                  value={selectedItem.pageId?.toString() ?? ""}
                  label="Page"
                  onChange={(e) => {
                    const val = e.target.value as string;
                    updateSelected({
                      pageId: val === "" ? null : Number(val),
                    });
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MuiMenuItem value="">(none)</MuiMenuItem>
                  {pages.map((p) => (
                    <MuiMenuItem value={p.id.toString()} key={p.id}>
                      {p.title}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedItem.linkType === "external" && (
              <TextField
                label="External URL"
                value={selectedItem.url ?? ""}
                onChange={(e) => updateSelected({ url: e.target.value })}
                placeholder="https://example.com"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}

            <TextField
              label="Icon (Optional)"
              value={selectedItem.icon ?? ""}
              onChange={(e) => updateSelected({ icon: e.target.value })}
              helperText="Material Icon name (e.g., Home, Star)"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selectedItem.openInNewTab}
                    onChange={(e) => updateSelected({ openInNewTab: e.target.checked })}
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <OpenInNewIcon fontSize="small" />
                    <Typography variant="body2">Open in new tab</Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selectedItem.showInMobile}
                    onChange={(e) => updateSelected({ showInMobile: e.target.checked })}
                    sx={{
                      '&.Mui-checked': {
                        color: 'success.main',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartphoneIcon fontSize="small" />
                    <Typography variant="body2">Show in mobile menu</Typography>
                  </Box>
                }
              />
            </Box>

            <Divider />

            <Stack direction="row" spacing={1.5}>
              <Button 
                variant="contained" 
                startIcon={<CheckCircleIcon />}
                onClick={() => notify("Item updated. Click 'Save All Changes' to persist.", { type: "info" })}
                fullWidth
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteItem(selectedItem.id)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'error.main',
                    color: 'white',
                  },
                }}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MenuBuilder;
