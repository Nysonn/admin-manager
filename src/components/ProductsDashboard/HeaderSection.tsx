import React from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useRefreshProducts } from "../../hooks/useProducts";

interface HeaderSectionProps {
  isFetching: boolean;
  dataUpdatedAt: number | undefined;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ isFetching, dataUpdatedAt }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const refreshProductsMutation = useRefreshProducts();

  const handleRefreshData = async () => {
    try {
      await refreshProductsMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("en-GB") : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.2),
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <InventoryIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight={700} 
            color="primary.main"
            sx={{ letterSpacing: '-0.02em' }}
          >
            Products Dashboard
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={isFetching || refreshProductsMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={handleRefreshData}
          disabled={isFetching || refreshProductsMutation.isPending}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Refresh Data
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ ml: 7.5, lineHeight: 1.7 }}>
        View and manage product inventory from external sources
      </Typography>
      {lastUpdated && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 7.5, display: 'block', mt: 0.5 }}>
          Last updated: {lastUpdated}
        </Typography>
      )}
    </Paper>
  );
};

export default HeaderSection;