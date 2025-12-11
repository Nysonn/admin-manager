import React from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ImageContextMenuProps } from "./types";

/**
 * Context menu for image actions
 */
const ImageContextMenu: React.FC<ImageContextMenuProps> = ({
  anchorEl,
  image,
  onClose,
  onCopyUrl,
  onDownload,
  onReplace,
  onShowDetails,
  onDelete,
}) => {
  if (!image) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onCopyUrl(image.url, image.filename);
          onClose();
        }}
      >
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy URL</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDownload(image.url, image.filename);
          onClose();
        }}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Download</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onReplace(image.id);
          onClose();
        }}
      >
        <ListItemIcon>
          <SwapHorizIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Replace</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          onShowDetails(image);
          onClose();
        }}
      >
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>View Details</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          onDelete(image);
          onClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ImageContextMenu;
