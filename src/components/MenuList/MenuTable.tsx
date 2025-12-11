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
    Alert,
    Skeleton,
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
                        <TableBody>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto' }} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="text" width="80%" height={24} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: 2 }} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="text" width="70%" height={24} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="text" width="60%" height={24} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Skeleton variant="text" width={60} height={24} />
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Skeleton variant="circular" width={32} height={32} />
                                            <Skeleton variant="circular" width={32} height={32} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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