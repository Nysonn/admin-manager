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
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import PreviewIcon from "@mui/icons-material/Preview";
import { useDataProvider, useNotify, useRefresh } from "react-admin";

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

  const [originalMenu, setOriginalMenu] = useState<MenuItemType[] | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pages, setPages] = useState<{ id: number; title: string }[]>([]);

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
    setMenuItems(deepClone(originalMenu));
    setSelectedId(null);
    notify("Changes discarded", { type: "info" });
  };

  /** Render recursive list as Droppable groups */
  const renderList = (items: MenuItemType[], parentId: string | "root" = "root", level = 0) => {
    const droppableId = droppableIdFor(parentId);
    return (
      <Droppable droppableId={droppableId} type="MENU">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((it, index) => (
              <Draggable draggableId={it.id} index={index} key={it.id}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    style={{
                      userSelect: "none",
                      padding: 8,
                      margin: "0 0 8px 0",
                      background: snapshot.isDragging ? "#e3f2fd" : "#fff",
                      borderRadius: 6,
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      ...dragProvided.draggableProps.style,
                    }}
                  >
                    {/* drag handle */}
                    <div {...dragProvided.dragHandleProps} style={{ marginRight: 8, display: "flex", alignItems: "center" }}>
                      <DragIndicatorIcon />
                    </div>

                    {/* main content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" noWrap>
                        {it.label}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {it.linkType === "internal"
                          ? `Page: ${it.pageId ?? "(none)"}`
                          : it.linkType === "external"
                          ? `${it.url}`
                          : "No link"}
                      </Typography>
                    </Box>

                    {/* actions */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        title="Edit"
                        onClick={() => {
                          setSelectedId(it.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Delete" onClick={() => deleteItem(it.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {/* render children recursively, indented */}
                    <div style={{ width: "100%" }} />
                    {it.children && it.children.length > 0 && (
                      <div style={{ marginLeft: 24, marginTop: 8, width: "100%" }}>{renderList(it.children, it.id, level + 1)}</div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  const selectedItem = selectedId ? findItem(menuItems, selectedId) : null;

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Left panel: Menu editor */}
      <Paper sx={{ width: "60%", p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6">Menu Editor</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<AddIcon />} variant="contained" onClick={addNewItem}>
              Add Menu Item
            </Button>
            <Button startIcon={<AddIcon />} variant="outlined" onClick={addChildToSelected} disabled={!selectedId}>
              Add Child
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* DragDropContext wraps the nested droppables */}
        <DragDropContext
          onDragEnd={(result) => {
            onDragEnd(result);
          }}
        >
          {menuItems.length === 0 ? (
            <Typography variant="body2">No menu items — add one to get started.</Typography>
          ) : (
            renderList(menuItems, "root")
          )}
        </DragDropContext>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button variant="outlined" startIcon={<UndoIcon />} onClick={discard}>
            Discard Changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={saveAll}
            disabled={JSON.stringify(menuItems) === JSON.stringify(originalMenu)}
          >
            Save All Changes
          </Button>
          <Button
            variant="text"
            startIcon={<PreviewIcon />}
            onClick={() => window.open("https://app.example.com/preview/menu", "_blank")}
          >
            Preview Menu
          </Button>
        </Box>
      </Paper>

      {/* Right panel: Item editor */}
      <Paper sx={{ width: "40%", p: 2 }}>
        <Typography variant="h6">Item Editor</Typography>
        <Divider sx={{ mb: 2 }} />
        {!selectedItem ? (
          <Typography variant="body2">Select a menu item on the left to edit its details.</Typography>
        ) : (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Label"
              value={selectedItem.label}
              onChange={(e) => updateSelected({ label: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="link-type-label">Link Type</InputLabel>
              <Select
                labelId="link-type-label"
                value={selectedItem.linkType}
                label="Link Type"
                onChange={(e) => updateSelected({ linkType: e.target.value as LinkType })}
              >
                <MuiMenuItem value="internal">Internal Page</MuiMenuItem>
                <MuiMenuItem value="external">External URL</MuiMenuItem>
                <MuiMenuItem value="none">No Link (Parent)</MuiMenuItem>
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
                fullWidth
              />
            )}

            <TextField
              label="Icon (name)"
              value={selectedItem.icon ?? ""}
              onChange={(e) => updateSelected({ icon: e.target.value })}
              helperText="Optional icon name (Material Icon name)."
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!selectedItem.openInNewTab}
                  onChange={(e) => updateSelected({ openInNewTab: e.target.checked })}
                />
              }
              label="Open in new tab"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!selectedItem.showInMobile}
                  onChange={(e) => updateSelected({ showInMobile: e.target.checked })}
                />
              }
              label="Show in mobile menu"
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={() => notify("Item saved locally — click Save All to persist.")}>
                Save Item
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  deleteItem(selectedItem.id);
                }}
              >
                Delete Item
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MenuBuilder;
