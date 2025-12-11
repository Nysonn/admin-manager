import React from "react";
import {
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { useMenuBuilder } from "../../hooks/useMenuBuilder";
import MenuBuilderHeader from "../../components/MenuBuilder/MenuBuilderHeader";
import MenuList from "../../components/MenuBuilder/MenuList";
import MenuItemEditor from "../../components/MenuBuilder/MenuItemEditor";
import MenuBuilderActions from "../../components/MenuBuilder/MenuBuilderActions";

const MenuBuilder: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    menuItems,
    selectedId,
    selectedItem,
    expandedItems,
    hasUnsavedChanges,
    pages,
    snackbar,
    isLoading,
    error,
    onDragEnd,
    addNewItem,
    addChildToSelected,
    deleteItem,
    updateSelected,
    saveAll,
    discard,
    toggleExpand,
    setSelectedId,
    showSnackbar,
    handleCloseSnackbar,
  } = useMenuBuilder();

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load menu. Please try again.</Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 3,
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Box sx={{ position: 'fixed', top: 80, right: 24, zIndex: 1000 }}>
          <Alert 
            severity="warning"
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
            }}
          >
            You have unsaved changes
          </Alert>
        </Box>
      )}

      {/* Left panel: Menu editor */}
      <Paper 
        elevation={0}
        sx={{ 
          width: isMobile ? '100%' : '60%',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        <MenuBuilderHeader
          itemCount={menuItems.length}
          onAddItem={addNewItem}
          onAddChild={addChildToSelected}
          selectedId={selectedId}
          isMobile={isMobile}
        />

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ minHeight: 300 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <MenuList
              items={menuItems}
              parentId="root"
              level={0}
              selectedId={selectedId}
              expandedItems={expandedItems}
              pages={pages}
              onSelectItem={setSelectedId}
              onDeleteItem={deleteItem}
              onToggleExpand={toggleExpand}
            />
          </DragDropContext>
        </Box>

        <Divider sx={{ my: 3 }} />

        <MenuBuilderActions
          hasUnsavedChanges={hasUnsavedChanges}
          isMobile={isMobile}
          onSave={saveAll}
          onDiscard={discard}
          onPreview={() => navigate("/menu-preview")}
        />
      </Paper>

      {/* Right panel: Item editor */}
      <Paper 
        elevation={0}
        sx={{ 
          width: isMobile ? '100%' : '40%',
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
          height: 'fit-content',
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 0 : 100,
        }}
      >
        <MenuItemEditor
          selectedItem={selectedItem ?? null}
          pages={pages}
          onUpdate={updateSelected}
          onDelete={deleteItem}
          onShowSnackbar={showSnackbar}
        />
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuBuilder;