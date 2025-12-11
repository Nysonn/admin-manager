import React, { useState } from "react";
import { TextInput, useDataProvider } from "react-admin";
import { 
  Box, 
  InputAdornment, 
  CircularProgress, 
  Typography,
} from "@mui/material";
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface SlugInputWithValidationProps { 
  currentId?: number | string 
}

// Enhanced SlugInput with real-time validation feedback
const SlugInputWithValidation: React.FC<SlugInputWithValidationProps> = ({ currentId }) => {
  const dataProvider = useDataProvider();
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Async validator function
  const checkSlug = async (value: string) => {
    if (!value) {
      setSlugStatus('idle');
      return "Required";
    }

    setSlugStatus('checking');
    try {
      // 1. Fetch records matching the slug
      const res = await dataProvider.getList("pages", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: { slug: value },
      });
      const list = Array.isArray((res as any).data) ? (res as any).data : [];
      
      // 2. Check for conflict, excluding the current page being edited
      const conflict = list.find((p: any) => p?.slug === value && p?.id !== currentId);
      
      if (conflict) {
        setSlugStatus('taken');
        return "This slug is already in use";
      }
      
      setSlugStatus('available');
      return undefined;
    } catch (err) {
      console.warn("Slug validation failed:", err);
      // Revert to idle if API call fails but allow form submission
      setSlugStatus('idle');
      return undefined;
    }
  };

  const getEndAdornment = () => {
    if (slugStatus === 'checking') {
      return (
        <InputAdornment position="end">
          <CircularProgress size={20} />
        </InputAdornment>
      );
    }
    if (slugStatus === 'available') {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
        </InputAdornment>
      );
    }
    if (slugStatus === 'taken') {
      return (
        <InputAdornment position="end">
          <ErrorIcon sx={{ color: 'error.main', fontSize: 24 }} />
        </InputAdornment>
      );
    }
    return null;
  };
  
  const getHelperText = () => {
    if (slugStatus === 'available') {
      return <Typography variant="caption" color="success.main" fontWeight={600}>Slug is available</Typography>;
    }
    if (slugStatus === 'taken') {
      return <Typography variant="caption" color="error.main" fontWeight={600}>Slug already in use</Typography>;
    }
    return "URL-safe characters only. This will be part of the page URL.";
  };

  return (
    <Box>
      <TextInput
        source="slug"
        label="Slug"
        validate={(value) => checkSlug(value)}
        fullWidth
        InputProps={{
          endAdornment: getEndAdornment(),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <Typography variant="caption" sx={{ ml: 2 }}>{getHelperText()}</Typography>
    </Box>
  );
};

export default SlugInputWithValidation;