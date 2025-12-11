import React from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    alpha,
    useTheme,
    CircularProgress,
    Alert,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { UseMenuManagement } from "../../hooks/useMenuManagement";
import MenuTableRow from "./MenuTableRow";

interface MenuTableProps {
    state: UseMenuManagement[0];
    actions: UseMenuManagement[1];
}

const MenuTable: React.FC<MenuTableProps> = ({ state, actions }) => {
    const theme = useTheme();
    const { localItems, isLoading, error } = state;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Failed to load menu items. Please try again.</Alert>
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: `0 1px 3px ${alpha("#000", 0.08)}`,
            }}
        >
            <DragDropContext onDragEnd={actions.handleDragEnd}>
                <Droppable droppableId="menu-items">
                    {(provided) => (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: 50, bgcolor: alpha(theme.palette.primary.main, 0.06) }}></TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                            Label
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                            Type
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                            Link To
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                            URL
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                                            Options
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.06), width: 150 }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                    {Array.isArray(localItems) && localItems.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <MenuTableRow
                                                    item={item}
                                                    provided={provided}
                                                    snapshot={snapshot}
                                                    actions={actions}
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Droppable>
            </DragDropContext>

            {localItems.length === 0 && !isLoading && (
                <Box sx={{ p: 8, textAlign: "center" }}>
                    <MenuBookIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No menu items yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Add your first menu item to get started
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={actions.handleAdd}>
                        Add Menu Item
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default MenuTable;