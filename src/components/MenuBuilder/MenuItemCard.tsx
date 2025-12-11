import React from "react";
import { Box, IconButton, Typography, Tooltip, Chip, Zoom, alpha, useTheme, Collapse, Stack } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LinkIcon from "@mui/icons-material/Link";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import type { MenuItemType, Page, LinkType } from '../../types/menu.types';

interface MenuItemCardProps {
  item: MenuItemType;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  pages: Page[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  renderChildren?: () => React.ReactNode;
}

const getLinkIcon = (linkType: LinkType) => {
  switch (linkType) {
    case 'internal': return <DescriptionIcon fontSize="small" />;
    case 'external': return <LanguageIcon fontSize="small" />;
    default: return <FolderIcon fontSize="small" />;
  }
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  index,
  isSelected,
  isExpanded,
  pages,
  onSelect,
  onDelete,
  onToggleExpand,
  renderChildren,
}) => {
  const theme = useTheme();
  const hasChildren = item.children && item.children.length > 0;

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
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
                  onClick={() => onToggleExpand(item.id)}
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
                  item.linkType === 'internal' 
                    ? theme.palette.primary.main
                    : item.linkType === 'external'
                    ? theme.palette.info.main
                    : theme.palette.grey[500],
                  0.15
                ),
                color: item.linkType === 'internal' 
                  ? 'primary.main'
                  : item.linkType === 'external'
                  ? 'info.main'
                  : 'text.secondary',
              }}
            >
              {getLinkIcon(item.linkType)}
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
                  {item.label}
                </Typography>
                {item.openInNewTab && (
                  <Tooltip title="Opens in new tab" arrow>
                    <OpenInNewIcon 
                      sx={{ 
                        fontSize: 14, 
                        color: 'text.secondary',
                      }} 
                    />
                  </Tooltip>
                )}
                {item.showInMobile && (
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
                    label={`${item.children!.length}`}
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
                {item.linkType === "internal" ? (
                  <>
                    <LinkIcon sx={{ fontSize: 12 }} />
                    Page: {pages.find(p => p.id === item.pageId)?.title || `#${item.pageId}` || "(none)"}
                  </>
                ) : item.linkType === "external" ? (
                  <>
                    <LinkIcon sx={{ fontSize: 12 }} />
                    {item.url || "(no URL)"}
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
                  onClick={() => onSelect(item.id)}
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
                  onClick={() => onDelete(item.id)}
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
          {hasChildren && renderChildren && (
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
                {renderChildren()}
              </Box>
            </Collapse>
          )}
        </Box>
      )}
    </Draggable>
  );
};

export default MenuItemCard;