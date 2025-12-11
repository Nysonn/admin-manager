import React from "react";
import { Button, Stack } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import SaveIcon from "@mui/icons-material/Save";
import PreviewIcon from "@mui/icons-material/Preview";

interface MenuBuilderActionsProps {
  hasUnsavedChanges: boolean;
  isMobile: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onPreview: () => void;
}

const MenuBuilderActions: React.FC<MenuBuilderActionsProps> = ({
  hasUnsavedChanges,
  isMobile,
  onSave,
  onDiscard,
  onPreview,
}) => {
  return (
    <Stack 
      direction={isMobile ? "column" : "row"} 
      spacing={1.5}
      sx={{ justifyContent: "flex-end" }}
    >
      <Button 
        variant="outlined" 
        startIcon={<UndoIcon />} 
        onClick={onDiscard}
        disabled={!hasUnsavedChanges}
        fullWidth={isMobile}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        }}
      >
        Discard Changes
      </Button>
      <Button
        variant="contained"
        color="success"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={!hasUnsavedChanges}
        fullWidth={isMobile}
        sx={{
          borderRadius: 2,
          px: 3,
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }}
      >
        Save All Changes
      </Button>
      <Button
        variant="contained"
        color="info"
        startIcon={<PreviewIcon />}
        onClick={onPreview}
        fullWidth={isMobile}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        Preview Menu
      </Button>
    </Stack>
  );
};

export default MenuBuilderActions;