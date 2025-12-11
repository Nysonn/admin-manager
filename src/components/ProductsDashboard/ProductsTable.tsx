import React from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Avatar,
  Chip,
  Skeleton,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import type { Product } from "../../types";
import { format as formatCurrency } from "currency-formatter";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  perPage: number;
  total: number;
  page: number;
  setPage: (updater: (p: number) => number) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  isError,
  refetch,
  perPage,
  total,
  page,
  setPage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getTableBodyContent = () => {
    if (isLoading) {
      // show professional skeleton rows
      return Array.from({ length: perPage }).map((_, idx) => (
        <TableRow key={`skeleton-${idx}`}>
          <TableCell width={80} sx={{ py: 2 }}>
            <Skeleton 
              variant="rectangular" 
              width={64} 
              height={48} 
              sx={{ 
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
              }} 
            />
          </TableCell>
          <TableCell sx={{ maxWidth: 240, py: 2 }}>
            <Skeleton variant="text" width="85%" height={24} sx={{ mb: 0.5 }} />
          </TableCell>
          {!isTablet && (
            <TableCell sx={{ maxWidth: 360, py: 2 }}>
              <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="75%" height={20} />
            </TableCell>
          )}
          <TableCell sx={{ py: 2 }}>
            <Skeleton variant="text" width={70} height={28} />
          </TableCell>
          {!isMobile && (
            <>
              <TableCell sx={{ py: 2 }}>
                <Skeleton 
                  variant="rounded" 
                  width={100} 
                  height={24} 
                  sx={{ borderRadius: 1.5 }} 
                />
              </TableCell>
              <TableCell sx={{ py: 2 }}>
                <Skeleton 
                  variant="rounded" 
                  width={80} 
                  height={24} 
                  sx={{ borderRadius: 1.5 }} 
                />
              </TableCell>
            </>
          )}
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <Box sx={{ p: 4, display: "flex", flexDirection: 'column', alignItems: "center", gap: 2 }}>
              <Typography color="error" variant="h6">Unable to load products.</Typography>
              <Button 
                variant="contained" 
                onClick={() => refetch()}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Retry
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    if (products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7}>
            <Box sx={{ p: 6, textAlign: "center" }}>
              <InventoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No products found.</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Try adjusting your filters or search query.</Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    // Render actual product rows
    return products.map((p) => (
      <TableRow 
        key={p.id}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <TableCell width={80} sx={{ py: 2 }}>
          <Avatar 
            variant="square" 
            src={p.image} 
            alt={p.title} 
            sx={{ 
              width: 64, 
              height: 48, 
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
            }} 
          />
        </TableCell>

        <TableCell sx={{ maxWidth: 240, py: 2 }}>
          <Typography fontWeight={600} noWrap>{p.title}</Typography>
        </TableCell>

        {!isTablet && (
          <TableCell sx={{ maxWidth: 360, py: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {p.description}
            </Typography>
          </TableCell>
        )}

        <TableCell sx={{ py: 2 }}>
          <Typography fontWeight={600} color="success.main">
            {formatCurrency(p.price ?? 0, { code: "USD" })}
          </Typography>
        </TableCell>

        {!isMobile && (
          <>
            <TableCell sx={{ py: 2 }}>
              <Chip 
                label={p.category ?? "—"} 
                size="small"
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  backgroundColor: alpha('#ff9800', 0.1),
                  color: '#ff9800',
                }}
              />
            </TableCell>

            <TableCell sx={{ py: 2 }}>
              {/* derive stock state from rating.count (demo logic) */}
              {p.rating && p.rating.count > 0 ? (
                <Chip 
                  label="In stock" 
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 600,
                    backgroundColor: alpha('#4caf50', 0.1),
                    color: '#4caf50',
                  }}
                />
              ) : (
                <Chip 
                  label="Out of stock" 
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 600,
                    backgroundColor: alpha('#000', 0.08),
                    color: 'text.secondary',
                  }}
                />
              )}
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };


  return (
    <>
      {/* Table Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Name</TableCell>
                {!isTablet && <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Description</TableCell>}
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Price</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Category</TableCell>}
                {!isMobile && <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Stock</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>{getTableBodyContent()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Pagination Summary */}
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mt: 3,
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button 
            disabled={page <= 1} 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Previous
          </Button>
          <Button 
            disabled={products.length < perPage} 
            onClick={() => setPage((p) => p + 1)}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ProductsTable;