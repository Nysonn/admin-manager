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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "../../api/productsApi";
import type { Product } from  "../../api/productsApi";
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
  const [selectedProductId, setSelectedProductId] = useState<number | string | null>(null);

  // Compose params
  const params = useMemo(
    () => ({ page, perPage, search: search.trim(), category: category || undefined }),
    [page, perPage, search, category]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 60_000,
    // onError: handle etc.
  });

  const total = data?.total ?? 0;
  const products: Product[] = data?.data ?? [];

  // product details modal query
  const productDetailsQuery = useQuery({
    queryKey: ["product", selectedProductId],
    queryFn: () => (selectedProductId ? fetchProductById(selectedProductId) : Promise.reject("No id")),
    enabled: !!selectedProductId,
    staleTime: 60_000,
    retry: 1,
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("en-GB") : null;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Products Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={isFetching}
          sx={{ ml: "auto" }}
        >
          Refresh Data
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          select
          size="small"
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption">Last updated:</Typography>
          <Typography variant="caption" color="textSecondary">
            {lastUpdated ?? (isLoading ? "—" : "No data")}
          </Typography>
        </Box>
      </Box>

      {/* Content area */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading
                ? // show skeleton rows
                  Array.from({ length: perPage }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell>
                        <Skeleton variant="rectangular" width={64} height={48} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="60%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="90%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="40%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="50%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="40%" />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                    </TableRow>
                  ))
                : isError
                ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography color="error">Unable to load products.</Typography>
                        <Button variant="contained" onClick={() => refetch()}>
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
                      <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography>No products found.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
                : products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell width={80}>
                        <Avatar variant="square" src={p.image} alt={p.title} sx={{ width: 64, height: 48 }} />
                      </TableCell>

                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography noWrap>{p.title}</Typography>
                      </TableCell>

                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" noWrap>
                          {p.description}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography>{formatCurrency(p.price ?? 0, { code: "USD" })}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip label={p.category ?? "—"} size="small" />
                      </TableCell>

                      <TableCell>
                        {/* derive stock state from rating.count (demo) */}
                        {p.rating && p.rating.count > 0 ? (
                          <Chip label="In stock" color="success" size="small" />
                        ) : (
                          <Chip label="Out of stock" size="small" />
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedProductId(p.id)}
                          startIcon={<OpenInNewIcon />}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* pagination summary */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Typography variant="caption">
          Showing {products.length} of {total} products
        </Typography>
        <Box>
          <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <Button disabled={products.length < perPage} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Product details modal */}
      <Dialog open={!!selectedProductId} onClose={() => setSelectedProductId(null)} maxWidth="md" fullWidth>
        <DialogTitle>Product details</DialogTitle>
        <DialogContent dividers>
          {productDetailsQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : productDetailsQuery.isError ? (
            <Box sx={{ p: 2 }}>
              <Typography color="error">Failed to load product details.</Typography>
            </Box>
          ) : (
            (() => {
              const p = productDetailsQuery.data as Product;
              if (!p) return null;
              return (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ width: 320 }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", borderRadius: 6 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{p.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1 }}>
                      {p.category}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {p.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {formatCurrency(p.price ?? 0, { code: "USD" })}
                    </Typography>

                    {p.rating && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Rating: {p.rating.rate} ({p.rating.count} reviews)
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      onClick={() => {
                        // open real product link in new tab
                        // fakestoreapi doesn't provide external link; open product id page as example
                        const url = `${import.meta.env.VITE_PRODUCTS_FRONTEND_URL ?? window.location.origin}/products/${p.id}`;
                        window.open(url, "_blank");
                      }}
                    >
                      Visit Product
                    </Button>
                  </Box>
                </Box>
              );
            })()
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProductId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
