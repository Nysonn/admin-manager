import React from "react";
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  MenuItem, 
  Chip,
  Paper,
  Stack,
  Divider,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CategoryIcon from "@mui/icons-material/Category";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "electronics", label: "Electronics" },
  { value: "jewelery", label: "Jewelery" },
  { value: "men's clothing", label: "Men's clothing" },
  { value: "women's clothing", label: "Women's clothing" },
];

interface FiltersSectionProps {
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
  isLoading: boolean;
  productsLength: number;
  total: number;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  isLoading,
  productsLength,
  total,
}) => {
  const theme = useTheme();

  const handleClearAll = () => {
    setSearch('');
    setCategory('');
  };

  // Define common input styles
  const inputBaseSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      backgroundColor: alpha('#000', 0.02),
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: alpha(theme.palette.primary.main, 0.2),
      },
      '& input::placeholder': {
        color: alpha(theme.palette.text.secondary, 0.6),
        opacity: 1,
      },
    },
  };

  const searchInputSx = {
    ...inputBaseSx,
    '& .MuiOutlinedInput-root': {
      ...inputBaseSx['& .MuiOutlinedInput-root'],
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
  };

  const categoryInputSx = {
    ...inputBaseSx,
    '& .MuiOutlinedInput-root': {
      ...inputBaseSx['& .MuiOutlinedInput-root'],
      '&:hover': {
        backgroundColor: 'background.paper',
        boxShadow: `0 0 0 2px ${alpha('#ff9800', 0.1)}`,
      },
      '&.Mui-focused': {
        backgroundColor: 'background.paper',
        boxShadow: `0 0 0 2px ${alpha('#ff9800', 0.2)}`,
      },
    },
  };


  return (
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
                `${productsLength} of ${total} products`
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
              onClick={handleClearAll}
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
            sx={searchInputSx}
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
            sx={categoryInputSx}
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
  );
};

export default FiltersSection;