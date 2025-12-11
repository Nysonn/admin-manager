import React from "react";
import { Box, Alert, Snackbar } from "@mui/material";
import { useMenuManagement } from "../../hooks/useMenuManagement";
import MenuHeader from "../../components/MenuList/MenuHeader";
import MenuTable from "../../components/MenuList/MenuTable";
import MenuDialogs from "../../components/MenuList/MenuDialogs";

const MenuList: React.FC = () => {
  const [state, actions] = useMenuManagement();

  return (
    <Box sx={{ pt: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <MenuHeader actions={actions} />

      {/* Menu Items Table */}
      <MenuTable state={state} actions={actions} />

      {/* Add/Edit Dialogs */}
      <MenuDialogs state={state} actions={actions} />

      {/* Snackbar for notifications */}
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={6000}
        onClose={actions.handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={actions.handleCloseSnackbar} severity={state.snackbar.severity} sx={{ width: "100%" }}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuList;