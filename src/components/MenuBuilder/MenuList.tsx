import React from "react";
import { Paper, Typography, alpha, useTheme } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import FolderIcon from "@mui/icons-material/Folder";
import MenuItemCard from "./MenuItemCard";
import type { MenuItemType, Page } from '../../types/menu.types';
import { droppableIdFor } from '../../utils/droppable.utils';

interface MenuListProps {
  items: MenuItemType[];
  parentId: string | "root";
  level: number;
  selectedId: string | null;
  expandedItems: Set<string>;
  pages: Page[];
  onSelectItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  parentId = "root",
  level = 0,
  selectedId,
  expandedItems,
  pages,
  onSelectItem,
  onDeleteItem,
  onToggleExpand,
}) => {
  const theme = useTheme();
  const droppableId = droppableIdFor(parentId);

  return (
    <Droppable droppableId={droppableId} type="MENU" isDropDisabled={false}>
      {(provided, droppableSnapshot) => (
        <div 
          ref={provided.innerRef} 
          {...provided.droppableProps}
          style={{
            backgroundColor: droppableSnapshot.isDraggingOver 
              ? alpha(theme.palette.primary.main, 0.05)
              : 'transparent',
            borderRadius: 8,
            padding: droppableSnapshot.isDraggingOver ? 8 : 0,
            transition: 'all 0.2s ease',
            minHeight: items.length === 0 ? 60 : 'auto',
          }}
        >
          {items.map((it, index) => {
            const hasChildren = it.children && it.children.length > 0;
            const isExpanded = expandedItems.has(it.id);
            const isSelected = selectedId === it.id;

            return (
              <MenuItemCard
                key={it.id}
                item={it}
                index={index}
                isSelected={isSelected}
                isExpanded={isExpanded}
                pages={pages}
                onSelect={onSelectItem}
                onDelete={onDeleteItem}
                onToggleExpand={onToggleExpand}
                renderChildren={
                  hasChildren
                    ? () => (
                        <MenuList
                          items={it.children!}
                          parentId={it.id}
                          level={level + 1}
                          selectedId={selectedId}
                          expandedItems={expandedItems}
                          pages={pages}
                          onSelectItem={onSelectItem}
                          onDeleteItem={onDeleteItem}
                          onToggleExpand={onToggleExpand}
                        />
                      )
                    : undefined
                }
              />
            );
          })}
          {provided.placeholder}
          {items.length === 0 && level === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <FolderIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'text.disabled',
                  mb: 1,
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                No menu items yet. Click "Add Menu Item" to get started.
              </Typography>
            </Paper>
          )}
        </div>
      )}
    </Droppable>
  );
};

export default MenuList;