import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Typography,
  Divider,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import type { MenuItemType, Page, LinkType } from '../../types/menu.types';

interface MenuItemEditorProps {
  selectedItem: MenuItemType | null;
  pages: Page[];
  onUpdate: (patch: Partial<MenuItemType>) => void;
  onDelete: (id: string) => void;
  onShowSnackbar: (message: string, severity: "success" | "error" | "info" | "warning") => void;
}

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  selectedItem,
  pages,
  onUpdate,
  onDelete,
  onShowSnackbar,
}) => {
  const theme = useTheme();

  if (!selectedItem) {
    return (
      <>
        <Typography 
          variant="h6" 
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Item Editor
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Select an item to edit
        </Typography>

        <Divider sx={{ mb: 3 }} />

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
      </>
    );
  }

  return (
    <>
      <Typography 
        variant="h6" 
        fontWeight={700}
        sx={{ mb: 1 }}
      >
        Item Editor
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Editing: {selectedItem.label}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Label"
          value={selectedItem.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
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
            onChange={(e) => onUpdate({ linkType: e.target.value as LinkType })}
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
                onUpdate({
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
            onChange={(e) => onUpdate({ url: e.target.value })}
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
          onChange={(e) => onUpdate({ icon: e.target.value })}
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
                onChange={(e) => onUpdate({ openInNewTab: e.target.checked })}
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
                onChange={(e) => onUpdate({ showInMobile: e.target.checked })}
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
            onClick={() => onShowSnackbar("Item updated. Click 'Save All Changes' to persist.", "info")}
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
            onClick={() => onDelete(selectedItem.id)}
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
    </>
  );
};

export default MenuItemEditor;