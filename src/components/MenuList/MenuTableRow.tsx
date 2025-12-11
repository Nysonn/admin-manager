import React from "react";
import { 
    Box, 
    Typography, 
    TableCell, 
    TableRow, 
    Chip, 
    Stack, 
    Tooltip, 
    IconButton, 
    alpha,
    useTheme
} from "@mui/material";
import type { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MenuItem } from "../../types";
import type { MenuManagementActions } from "../../hooks/useMenuManagement";

interface MenuTableRowProps {
    item: MenuItem;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
    actions: MenuManagementActions;
}

const MenuTableRow: React.FC<MenuTableRowProps> = ({ item, provided, snapshot, actions }) => {
    const theme = useTheme();

    return (
        <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            sx={{
                bgcolor: snapshot.isDragging ? alpha(theme.palette.primary.main, 0.08) : "inherit",
                transition: "background-color 0.2s",
                "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
            }}
        >
            <TableCell {...provided.dragHandleProps}>
                <DragIndicatorIcon sx={{ color: "text.secondary", cursor: "grab" }} />
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon && (
                        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
                            {item.icon}
                        </Typography>
                    )}
                    <Typography fontWeight={600}>{item.label}</Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Chip
                    label={item.linkType}
                    size="small"
                    icon={item.linkType === "external" ? <LanguageIcon /> : <DescriptionIcon />}
                    color={item.linkType === "external" ? "secondary" : "primary"}
                    sx={{ textTransform: "capitalize" }}
                />
            </TableCell>
            <TableCell>
                {item.linkType === "internal" && item.pageId ? (
                    <Typography variant="body2">{actions.getPageTitle(item.pageId)}</Typography>
                ) : item.linkType === "external" ? (
                    <Typography variant="body2" color="text.secondary">
                        External URL
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        -
                    </Typography>
                )}
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LinkIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {actions.getUrl(item) || "-"}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={0.5}>
                    {item.openInNewTab && (
                        <Tooltip title="Opens in new tab">
                            <Chip
                                label={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                    )}
                    {item.showInMobile && (
                        <Tooltip title="Shows on mobile">
                            <Chip label="Mobile" size="small" variant="outlined" />
                        </Tooltip>
                    )}
                </Stack>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => actions.handleEdit(item)} color="primary">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => actions.handleDelete(item)} color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
};

export default MenuTableRow;