import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Chip,
  alpha,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Close as CloseIcon,
  OpenInNew,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDataProvider } from "react-admin";

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

const MenuPreview: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dataProvider = useDataProvider();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load menu from data provider
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const menuRes = await dataProvider.getOne("menu", { id: 1 });
        const items: MenuItemType[] = menuRes?.data?.items ? menuRes.data.items : [];
        setMenuItems(items);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [dataProvider]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMenuItemLink = (item: MenuItemType): string => {
    if (item.linkType === "internal" && item.pageId) {
      return `/preview/${item.pageId}`;
    }
    if (item.linkType === "external" && item.url) {
      return item.url;
    }
    return "#";
  };

  const handleMenuClick = (item: MenuItemType) => {
    if (item.linkType === "none" && item.children && item.children.length > 0) {
      toggleExpand(item.id);
    } else {
      const link = getMenuItemLink(item);
      if (item.openInNewTab && item.linkType === "external") {
        window.open(link, "_blank");
      } else if (item.linkType === "internal") {
        navigate(link);
      }
    }
  };

  const renderMenuItem = (item: MenuItemType, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isParent = item.linkType === "none";

    if (isMobile && !item.showInMobile) {
      return null;
    }

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

  const menuContent = (
    <Box sx={{ py: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {menuItems.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No menu items"
                secondary="Configure your menu in the admin panel"
              />
            </ListItem>
          ) : (
            menuItems.map((item) => renderMenuItem(item))
          )}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => navigate("/menu")}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu Preview
          </Typography>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Paper
            elevation={2}
            sx={{
              width: 280,
              borderRadius: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: "auto",
            }}
          >
            {menuContent}
          </Paper>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 280,
              },
            }}
          >
            {menuContent}
          </Drawer>
        )}

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
          }}
        >
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h4" gutterBottom fontWeight={700}>
                Menu Navigation Preview
              </Typography>
              <Divider sx={{ my: 3 }} />
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    About This Preview
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    This is a live preview of your menu structure. The menu is displayed in the
                    sidebar (or drawer on mobile) and shows how your visitors will navigate your site.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Hierarchical Navigation"
                        secondary="Menu items with children can be expanded/collapsed"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Mobile Responsive"
                        secondary="Menu adapts to mobile screens with a drawer interface"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="External Links"
                        secondary="Items marked to open in new tabs will do so"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Mobile Visibility Control"
                        secondary="Items can be hidden on mobile devices if configured"
                      />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Menu Statistics
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      label={`${menuItems.length} Top-level Items`}
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={`${menuItems.reduce(
                        (acc, item) => acc + (item.children?.length || 0),
                        0
                      )} Sub-items`}
                      color="secondary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={`${
                        menuItems.filter((item) => item.showInMobile).length +
                        menuItems.reduce(
                          (acc, item) =>
                            acc +
                            (item.children?.filter((c) => c.showInMobile).length || 0),
                          0
                        )
                      } Mobile-visible`}
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                  }}
                >
                  <Typography variant="body2" color="info.dark">
                    <strong>Tip:</strong> Try resizing your browser window to see how the menu
                    adapts between desktop and mobile views. On mobile, use the menu icon in the
                    top-right corner to open the navigation drawer.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuPreview;
