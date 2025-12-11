import React from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useProduct } from "../../hooks/useProducts";
import type { Product } from "../../types";
import { format as formatCurrency } from "currency-formatter";

interface ProductDetailsModalProps {
  selectedProductId: number | null;
  setSelectedProductId: (id: number | null) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  selectedProductId,
  setSelectedProductId,
}) => {
  const theme = useTheme();

  // product details modal query
  const productDetailsQuery = useProduct(selectedProductId!, !!selectedProductId);

  const handleClose = () => setSelectedProductId(null);
  
  const p = productDetailsQuery.data as Product | undefined;
  
  return (
    <Dialog 
      open={!!selectedProductId} 
      onClose={handleClose} 
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
          p ? (
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
          ) : null
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={handleClose}
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
  );
};

export default ProductDetailsModal;