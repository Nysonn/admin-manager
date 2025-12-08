import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Skeleton,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";
import { useProducts, useProduct, useRefreshProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";
import { format as formatCurrency } from "currency-formatter";

// Minimal categories list for filters. In production fetch from API.
const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "electronics", label: "Electronics" },
  { value: "jewelery", label: "Jewelery" },
  { value: "men's clothing", label: "Men's clothing" },
  { value: "women's clothing", label: "Women's clothing" },
];

export default function ProductsDashboard() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Compose params
  const params = useMemo(
    () => ({ 
      page, 
      perPage, 
      search: search.trim() || undefined, 
      category: category || undefined 
    }),
    [page, perPage, search, category]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useProducts(params);

  const refreshProductsMutation = useRefreshProducts();

  const total = data?.total ?? 0;
  const products: Product[] = data?.data ?? [];

  // product details modal query
  const productDetailsQuery = useProduct(selectedProductId!, !!selectedProductId);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("en-GB") : null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleRefreshData = async () => {
    try {
      await refreshProductsMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  return (
    <Box sx={{ pt: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
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

      {/* Filters Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          backgroundColor: 'background.paper',
          boxShadow: `0 1px 3px ${alpha('#000', 0.08)}`,
        }}
      >
        {/* Header with Results Count */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <FilterListIcon sx={{ fontSize: 22, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                Filter Products
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isLoading ? (
                  <Skeleton width={80} />
                ) : (
                  `${products.length} of ${total} products`
                )}
              </Typography>
            </Box>
          </Box>
          
          {/* Active Filters Display */}
          {(search || category) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Active filters:
              </Typography>
              {search && (
                <Chip
                  label={`Search: "${search}"`}
                  size="small"
                  onDelete={() => setSearch('')}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    },
                  }}
                />
              )}
              {category && (
                <Chip
                  label={`Category: ${CATEGORIES.find(c => c.value === category)?.label || category}`}
                  size="small"
                  onDelete={() => setCategory('')}
                  sx={{
                    backgroundColor: alpha('#ff9800', 0.1),
                    color: '#ff9800',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    '& .MuiChip-deleteIcon': {
                      color: '#ff9800',
                      '&:hover': {
                        color: '#f57c00',
                      },
                    },
                  }}
                />
              )}
              <Button
                size="small"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  minWidth: 'auto',
                  px: 1,
                }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Filter Inputs */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              Search Products
            </Typography>
            <TextField
              placeholder="Type to search by name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: alpha('#000', 0.02),
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '& fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
                '& input::placeholder': {
                  color: alpha(theme.palette.text.secondary, 0.6),
                  opacity: 1,
                },
              }}
            />
          </Box>
          <Box sx={{ minWidth: { md: 280 } }}>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1.5 }}>
              Category
            </Typography>
            <TextField
              placeholder="Select category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              select
              size="medium"
              fullWidth
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                    <CategoryIcon sx={{ color: '#ff9800', fontSize: 22 }} />
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: alpha('#000', 0.02),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 2px ${alpha('#ff9800', 0.1)}`,
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                    boxShadow: `0 0 0 2px ${alpha('#ff9800', 0.2)}`,
                  },
                },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem 
                  key={c.value} 
                  value={c.value}
                  sx={{
                    borderRadius: 1.5,
                    mx: 1,
                    my: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: alpha('#ff9800', 0.1),
                      '&:hover': {
                        backgroundColor: alpha('#ff9800', 0.15),
                      },
                    },
                  }}
                >
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
      </Paper>

      {/* Content area */}
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
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.8125rem', letterSpacing: '0.05em' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading
                ? // show skeleton rows
                  Array.from({ length: perPage }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
                      <TableCell>
                        <Skeleton variant="rectangular" width={64} height={48} sx={{ borderRadius: 1 }} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="60%" />
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          <Skeleton width="90%" />
                        </TableCell>
                      )}
                      <TableCell>
                        <Skeleton width="40%" />
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            <Skeleton width="50%" />
                          </TableCell>
                          <TableCell>
                            <Skeleton width="40%" />
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                    </TableRow>
                  ))
                : isError
                ? (
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
                )
                : products.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ p: 6, textAlign: "center" }}>
                        <InventoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No products found.</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Try adjusting your filters or search query.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
                : products.map((p) => (
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
                            {/* derive stock state from rating.count (demo) */}
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

                      <TableCell sx={{ py: 2 }}>
                        <Tooltip title="View details" arrow>
                          <IconButton
                            size="small"
                            onClick={() => setSelectedProductId(p.id)}
                            sx={{
                              color: 'primary.main',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* pagination summary */}
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

      {/* Product details modal */}
      <Dialog 
        open={!!selectedProductId} 
        onClose={() => setSelectedProductId(null)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider' }}>
          Product Details
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {productDetailsQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
              <CircularProgress size={48} />
            </Box>
          ) : productDetailsQuery.isError ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error" variant="h6">Failed to load product details.</Typography>
            </Box>
          ) : (
            (() => {
              const p = productDetailsQuery.data as Product;
              if (!p) return null;
              return (
                <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ width: { xs: '100%', md: 320 } }}>
                    <Box
                      component="img"
                      src={p.image}
                      alt={p.title}
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        objectFit: 'contain',
                        aspectRatio: '1',
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {p.title}
                    </Typography>
                    <Chip
                      label={p.category}
                      size="small"
                      sx={{
                        mb: 2,
                        borderRadius: 1.5,
                        fontWeight: 600,
                        backgroundColor: alpha('#ff9800', 0.1),
                        color: '#ff9800',
                      }}
                    />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {p.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Price
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {formatCurrency(p.price ?? 0, { code: "USD" })}
                        </Typography>
                      </Box>
                      {p.rating && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Rating
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                            <Typography variant="h6" fontWeight={600}>
                              {p.rating.rate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({p.rating.count} reviews)
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        const url = `${import.meta.env.VITE_PRODUCTS_FRONTEND_URL ?? window.location.origin}/products/${p.id}`;
                        window.open(url, "_blank");
                      }}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      }}
                    >
                      Visit Product Page
                    </Button>
                  </Box>
                </Box>
              );
            })()
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setSelectedProductId(null)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
