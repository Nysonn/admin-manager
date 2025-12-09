import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Chip,
  Typography,
  alpha,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  OpenInNew,
} from "@mui/icons-material";
import type { MenuItemType } from "../../pages/MenuPreview"; 

interface MenuSidebarProps {
  menuItems: MenuItemType[];
  isLoading: boolean;
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
  handleMenuClick: (item: MenuItemType) => void;
}

export const MenuSidebar: React.FC<MenuSidebarProps> = ({
  menuItems,
  isLoading,
  expandedItems,
  handleMenuClick,
}) => {
  const theme = useTheme();

  const renderMenuItem = (item: MenuItemType, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isParent = item.linkType === "none";

    return (
      <React.Fragment key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2,
            borderLeft: level > 0 ? `2px solid ${theme.palette.divider}` : "none",
            ml: level > 0 ? 1 : 0,
          }}
        >
          <ListItemButton
            onClick={() => handleMenuClick(item)}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant={level === 0 ? "subtitle1" : "body2"}
                    fontWeight={level === 0 ? 600 : 500}
                  >
                    {item.label}
                  </Typography>
                  {item.openInNewTab && item.linkType === "external" && (
                    <OpenInNew sx={{ fontSize: 14, color: "text.secondary" }} />
                  )}
                  {isParent && (
                    <Chip
                      label="Parent"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        color: "info.main",
                      }}
                    />
                  )}
                </Box>
              }
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {menuItems.length === 0 ? (
        <List>
          <ListItem>
            <ListItemText
              primary="No menu items"
              secondary="Configure your menu in the admin panel"
            />
          </ListItem>
        </List>
      ) : (
        <List>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      )}
    </Box>
  );
};