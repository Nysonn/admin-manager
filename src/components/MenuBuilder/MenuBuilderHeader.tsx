import React from "react";
import { Box, Button, Typography, Badge, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface MenuBuilderHeaderProps {
  itemCount: number;
  onAddItem: () => void;
  onAddChild: () => void;
  selectedId: string | null;
  isMobile: boolean;
}

const MenuBuilderHeader: React.FC<MenuBuilderHeaderProps> = ({
  itemCount,
  onAddItem,
  onAddChild,
  selectedId,
  isMobile,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{
              color: 'primary.main',
              mb: 0.5,
            }}
          >
            Menu Editor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag items to reorder • Click to edit
          </Typography>
        </Box>
        <Badge 
          badgeContent={itemCount} 
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.875rem',
              fontWeight: 700,
              height: 24,
              minWidth: 24,
              borderRadius: 12,
            },
          }}
        >
          <Box />
        </Badge>
      </Box>

      <Stack direction={isMobile ? "column" : "row"} spacing={1.5}>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          onClick={onAddItem}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Add Menu Item
        </Button>
        <Button 
          startIcon={<AddIcon />} 
          variant="outlined" 
          onClick={onAddChild} 
          disabled={!selectedId}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Add Child
        </Button>
      </Stack>
    </Box>
  );
};

export default MenuBuilderHeader;