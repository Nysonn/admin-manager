import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  alpha,
  useTheme,
  useMediaQuery,
  Snackbar,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useAllMenuItems, useUpdateMenu, useAddMenuItem, useReorderMenuItems } from "../../hooks/useMenu";
import { usePages } from "../../hooks/usePages";
import type { MenuItem, AddMenuItemInput } from "../../types";

const MenuList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: menuItems, isLoading, error, refetch } = useAllMenuItems();
  const { data: pagesData } = usePages({ page: 1, perPage: 100 });
  const updateMenuMutation = useUpdateMenu();
  const addMenuItemMutation = useAddMenuItem();
  const reorderMutation = useReorderMenuItems();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [localItems, setLocalItems] = useState<MenuItem[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const pages = pagesData?.data || [];

  // Sync local items with fetched data
  React.useEffect(() => {
    if (menuItems && Array.isArray(menuItems)) {
      setLocalItems(menuItems);
    }
  }, [menuItems]);

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    label: "",
    linkType: "internal",
    pageId: undefined,
    url: "",
    icon: "",
    openInNewTab: false,
    showInMobile: true,
  });

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
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update menu item";
      showSnackbar(`Error: ${errorMessage}`, "error");
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
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add menu item";
      showSnackbar(`Error: ${errorMessage}`, "error");
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
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete menu item";
      showSnackbar(`Error: ${errorMessage}`, "error");
      console.error("Failed to delete menu item:", error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (!Array.isArray(localItems) || localItems.length === 0) return;

    const items = Array.from(localItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalItems(items);

    try {
      await reorderMutation.mutateAsync({
        id: 1,
        itemIds: items.map((item) => item.id),
      });
      showSnackbar("Menu items reordered successfully!", "success");
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to reorder menu items";
      showSnackbar(`Error: ${errorMessage}`, "error");
      console.error("Failed to reorder menu items:", error);
      // Revert on error
      if (menuItems && Array.isArray(menuItems)) {
        setLocalItems(menuItems);
      }
    }
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load menu items. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 2.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <MenuBookIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
                color="primary.main"
                sx={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
              >
                Menu Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Manage navigation menu items and their order
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => refetch()} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                px: 3,
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Menu Items Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: `0 1px 3px ${alpha("#000", 0.08)}`,
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-items">
            {(provided) => (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 50, bgcolor: alpha(theme.palette.primary.main, 0.06) }}></TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                        Label
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                        Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                        Link To
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                        URL
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                        Options
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06), width: 150 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                    {Array.isArray(localItems) && localItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              bgcolor: snapshot.isDragging ? alpha(theme.palette.primary.main, 0.08) : "inherit",
                              transition: "background-color 0.2s",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                              },
                            }}
                          >
                            <TableCell {...provided.dragHandleProps}>
                              <DragIndicatorIcon sx={{ color: "text.secondary", cursor: "grab" }} />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {item.icon && (
                                  <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
                                    {item.icon}
                                  </Typography>
                                )}
                                <Typography fontWeight={600}>{item.label}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.linkType}
                                size="small"
                                icon={item.linkType === "external" ? <LanguageIcon /> : <DescriptionIcon />}
                                color={item.linkType === "external" ? "secondary" : "primary"}
                                sx={{ textTransform: "capitalize" }}
                              />
                            </TableCell>
                            <TableCell>
                              {item.linkType === "internal" && item.pageId ? (
                                <Typography variant="body2">{getPageTitle(item.pageId)}</Typography>
                              ) : item.linkType === "external" ? (
                                <Typography variant="body2" color="text.secondary">
                                  External URL
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LinkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                                  {getUrl(item) || "-"}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                {item.openInNewTab && (
                                  <Tooltip title="Opens in new tab">
                                    <Chip
                                      label={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Tooltip>
                                )}
                                {item.showInMobile && (
                                  <Tooltip title="Shows on mobile">
                                    <Chip label="Mobile" size="small" variant="outlined" />
                                  </Tooltip>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => handleEdit(item)} color="primary">
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" onClick={() => handleDelete(item)} color="error">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Droppable>
        </DragDropContext>

        {localItems.length === 0 && !isLoading && (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <MenuBookIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No menu items yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first menu item to get started
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              Add Menu Item
            </Button>
          </Box>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Link Type</InputLabel>
              <Select
                value={formData.linkType}
                label="Link Type"
                onChange={(e) =>
                  setFormData({ ...formData, linkType: e.target.value as "internal" | "external" })
                }
              >
                <MuiMenuItem value="internal">Internal Page</MuiMenuItem>
                <MuiMenuItem value="external">External URL</MuiMenuItem>
              </Select>
            </FormControl>

            {formData.linkType === "internal" && (
              <FormControl fullWidth>
                <InputLabel>Page</InputLabel>
                <Select
                  value={formData.pageId || ""}
                  label="Page"
                  onChange={(e) => setFormData({ ...formData, pageId: Number(e.target.value) })}
                >
                  {pages.map((page) => (
                    <MuiMenuItem key={page.id} value={page.id}>
                      {page.title}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.linkType === "external" && (
              <TextField
                label="External URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                fullWidth
                placeholder="https://example.com"
              />
            )}

            <TextField
              label="Icon (emoji or text)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
              placeholder="🏠"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.openInNewTab}
                  onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                />
              }
              label="Open in new tab"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.showInMobile}
                  onChange={(e) => setFormData({ ...formData, showInMobile: e.target.checked })}
                />
              }
              label="Show on mobile"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={updateMenuMutation.isPending}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Link Type</InputLabel>
              <Select
                value={formData.linkType}
                label="Link Type"
                onChange={(e) =>
                  setFormData({ ...formData, linkType: e.target.value as "internal" | "external" })
                }
              >
                <MuiMenuItem value="internal">Internal Page</MuiMenuItem>
                <MuiMenuItem value="external">External URL</MuiMenuItem>
              </Select>
            </FormControl>

            {formData.linkType === "internal" && (
              <FormControl fullWidth>
                <InputLabel>Page</InputLabel>
                <Select
                  value={formData.pageId || ""}
                  label="Page"
                  onChange={(e) => setFormData({ ...formData, pageId: Number(e.target.value) })}
                >
                  {pages.map((page) => (
                    <MuiMenuItem key={page.id} value={page.id}>
                      {page.title}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {formData.linkType === "external" && (
              <TextField
                label="External URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                fullWidth
                placeholder="https://example.com"
              />
            )}

            <TextField
              label="Icon (emoji or text)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
              placeholder="🏠"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.openInNewTab}
                  onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                />
              }
              label="Open in new tab"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.showInMobile}
                  onChange={(e) => setFormData({ ...formData, showInMobile: e.target.checked })}
                />
              }
              label="Show on mobile"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveAdd}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={addMenuItemMutation.isPending}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuList;
