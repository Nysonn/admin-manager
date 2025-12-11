import React from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Stack, 
  Tooltip, 
  alpha, 
  useTheme, 
  useMediaQuery 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { MenuManagementActions } from "../../hooks/useMenuManagement";

interface MenuHeaderProps {
    actions: MenuManagementActions;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ actions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
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
                        <IconButton onClick={() => actions.refetch()} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={actions.handleAdd}
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
    );
};

export default MenuHeader;