import React from "react";
import { Box, Paper, Typography, Stack, Button, Checkbox, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { BulkActionsBarProps } from "./types";

/**
 * Bulk actions bar for managing multiple selected images
 */
const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onBulkDelete,
  onCancel,
}) => {
  const theme = useTheme();

  if (selectedCount === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        mb: 2,
        p: 2,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Checkbox
          checked={allSelected}
          indeterminate={selectedCount > 0 && selectedCount < totalCount}
          onChange={onSelectAll}
          sx={{ 
            color: 'white',
            '&.Mui-checked': { color: 'white' },
            '&.MuiCheckbox-indeterminate': { color: 'white' },
          }}
        />
        <Typography variant="subtitle1" fontWeight={600}>
          {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onBulkDelete}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          Delete Selected
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { 
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
};

export default BulkActionsBar;
