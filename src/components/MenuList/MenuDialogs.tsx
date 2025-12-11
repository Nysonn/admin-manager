import React from "react";
import {
  Button,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import type { UseMenuManagement } from "../../hooks/useMenuManagement";

interface MenuDialogsProps {
  state: UseMenuManagement[0];
  actions: UseMenuManagement[1];
}

const MenuDialogs: React.FC<MenuDialogsProps> = ({ state, actions }) => {
  const { 
    formData, 
    pages, 
    editDialogOpen, 
    addDialogOpen, 
    updateMenuMutation, 
    addMenuItemMutation 
  } = state;

  const { setEditDialogOpen, setAddDialogOpen, handleSaveEdit, handleSaveAdd } = actions;
  
  // Handlers to simplify form changes
  const handleFormChange = (key: keyof typeof formData, value: string | number | boolean | null) => {
      actions.setFormData({ ...formData, [key]: value });
  }

  const FormFields = (
    <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField
            label="Label"
            value={formData.label || ""}
            onChange={(e) => handleFormChange('label', e.target.value)}
            fullWidth
        />

        <FormControl fullWidth>
            <InputLabel>Link Type</InputLabel>
            <Select
                value={formData.linkType || "internal"}
                label="Link Type"
                onChange={(e) => handleFormChange('linkType', e.target.value as "internal" | "external")}
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
                    onChange={(e) => handleFormChange('pageId', Number(e.target.value))}
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
                value={formData.url || ""}
                onChange={(e) => handleFormChange('url', e.target.value)}
                fullWidth
                placeholder="https://example.com"
            />
        )}

        <TextField
            label="Icon (emoji or text)"
            value={formData.icon || ""}
            onChange={(e) => handleFormChange('icon', e.target.value)}
            fullWidth
            placeholder="🏠"
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={formData.openInNewTab || false}
                    onChange={(e) => handleFormChange('openInNewTab', e.target.checked)}
                />
            }
            label="Open in new tab"
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={formData.showInMobile || true}
                    onChange={(e) => handleFormChange('showInMobile', e.target.checked)}
                />
            }
            label="Show on mobile"
        />
    </Stack>
  );

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>{FormFields}</DialogContent>
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
        <DialogContent>{FormFields}</DialogContent>
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
    </>
  );
};

export default MenuDialogs;