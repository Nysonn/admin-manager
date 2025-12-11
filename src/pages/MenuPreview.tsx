import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Drawer,
  useTheme,
  useMediaQuery,
  Alert,
  Container,
  Skeleton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { MenuSidebar } from "../components/MenuPreview/MenuSidebar";
import { MenuPreviewHeader } from "../components/MenuPreview/MenuPreviewHeader";
import { MenuPreviewContent } from "../components/MenuPreview/MenuPreviewContent";

// Export types used in child components
export type LinkType = "internal" | "external" | "none";
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
  
  // Data Fetching & State
  const { data: menuData, isLoading, error } = useMenu(1);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Effect to sync fetched data
  useEffect(() => {
    if (menuData?.items) {
      setMenuItems(menuData.items);
    }
  }, [menuData]);

  // Logic Handlers
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

  // Function to handle link navigation/expansion
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

  const handleGoBack = () => {
    navigate("/menu");
  };

  // Filter items for mobile view based on showInMobile flag (including recursive filter)
  const filterMobileItems = (items: MenuItemType[]): MenuItemType[] => {
    return items
      .filter(item => !isMobile || item.showInMobile)
      .map(item => ({
        ...item,
        children: item.children ? filterMobileItems(item.children) : undefined,
      }));
  };
  
  const mobileVisibleItems = filterMobileItems(menuItems);


  // --- Render State Checks ---

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header Skeleton */}
        <Paper
          elevation={1}
          sx={{
            borderRadius: 0,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: { xs: 2, sm: 3 },
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={120} height={32} />
            </Box>
            <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
          </Box>
        </Paper>

        <Box sx={{ display: "flex", flex: 1 }}>
          {/* Sidebar Skeleton */}
          {!isMobile && (
            <Paper
              elevation={2}
              sx={{
                width: 280,
                borderRadius: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
                p: 3,
              }}
            >
              <Stack spacing={2}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width="50%" height={28} sx={{ mt: 2 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
              </Stack>
            </Paper>
          )}

          {/* Content Skeleton */}
          <Box sx={{ flex: 1, p: { xs: 2, sm: 4 } }}>
            <Container maxWidth="lg">
              <Skeleton variant="text" width="40%" height={48} sx={{ mb: 3 }} />
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="95%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="85%" height={24} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 3 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={24} />
              </Paper>
            </Container>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <MenuPreviewHeader mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} onGoBack={handleGoBack} />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">Failed to load menu. Please try again.</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1. Header */}
      <MenuPreviewHeader 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        onGoBack={handleGoBack} 
      />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* 2. Desktop Sidebar */}
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
            {/* Pass the full menu structure for desktop */}
            <MenuSidebar
              menuItems={menuItems} 
              isLoading={isLoading}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              handleMenuClick={handleMenuClick}
            />
          </Paper>
        )}

        {/* 3. Mobile Drawer */}
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
            {/* Pass the mobile-filtered menu structure for the drawer */}
            <MenuSidebar
              menuItems={mobileVisibleItems} 
              isLoading={isLoading}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              handleMenuClick={handleMenuClick}
            />
          </Drawer>
        )}

        {/* 4. Main Content Area */}
        <MenuPreviewContent menuItems={menuItems} />

      </Box>
    </Box>
  );
};

export default MenuPreview;