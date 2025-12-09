import React from "react";
import {
  Box,
  Typography,
  Divider,
  Container,
  Paper,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  alpha,
  useTheme,
} from "@mui/material";
import type { MenuItemType } from "../../pages/MenuPreview";

interface MenuPreviewContentProps {
  menuItems: MenuItemType[];
}

export const MenuPreviewContent: React.FC<MenuPreviewContentProps> = ({ menuItems }) => {
  const theme = useTheme();

  // Helper function to calculate statistics
  const totalSubItems = menuItems.reduce(
    (acc, item) => acc + (item.children?.length || 0),
    0
  );

  const totalMobileVisible = menuItems.reduce((acc, item) => {
    let count = 0;
    if (item.showInMobile) {
      count++;
    }
    // Check children's mobile visibility
    count += item.children?.filter((c) => c.showInMobile).length || 0;
    return acc + count;
  }, 0);
  
  return (
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
                  label={`${totalSubItems} Sub-items`}
                  color="secondary"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`${totalMobileVisible} Mobile-visible`}
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
  );
};