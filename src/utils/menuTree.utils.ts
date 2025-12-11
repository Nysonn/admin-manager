import type { MenuItemType } from '../types/menu.types';

export function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/** Find and remove an item by id; returns [removedItem, newTree] */
export function removeItemById(
  items: MenuItemType[], 
  id: string
): { removed?: MenuItemType; items: MenuItemType[] } {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      const removed = items[i];
      const newItems = [...items.slice(0, i), ...items.slice(i + 1)];
      return { removed, items: newItems };
    }
    if (items[i].children && items[i].children!.length) {
      const result = removeItemById(items[i].children!, id);
      if (result.removed) {
        const newParent = { ...items[i], children: result.items };
        const newItems = [...items.slice(0, i), newParent, ...items.slice(i + 1)];
        return { removed: result.removed, items: newItems };
      }
    }
  }
  return { items };
}

/** Insert an item into targetParentId's children at index. If parentId === "root", insert into root array. */
export function insertItemAt(
  items: MenuItemType[], 
  parentId: string | "root", 
  index: number, 
  item: MenuItemType
): MenuItemType[] {
  if (parentId === "root") {
    const copy = [...items];
    copy.splice(index, 0, item);
    return copy;
  }
  // recursive search to find parent
  const newItems = items.map((it) => {
    if (it.id === parentId) {
      const children = it.children ? [...it.children] : [];
      children.splice(index, 0, item);
      return { ...it, children };
    }
    if (it.children && it.children.length) {
      return { ...it, children: insertItemAt(it.children, parentId, index, item) };
    }
    return it;
  });
  return newItems;
}

/** Find and update an item by id with updater function */
export function updateItemById(
  items: MenuItemType[], 
  id: string, 
  updater: (item: MenuItemType) => MenuItemType
): MenuItemType[] {
  return items.map((it) => {
    if (it.id === id) {
      return updater(it);
    }
    if (it.children && it.children.length) {
      return { ...it, children: updateItemById(it.children, id, updater) };
    }
    return it;
  });
}

/** Find an item by id */
export function findItem(items: MenuItemType[], id: string): MenuItemType | undefined {
  for (const it of items) {
    if (it.id === id) return it;
    if (it.children && it.children.length) {
      const found = findItem(it.children, id);
      if (found) return found;
    }
  }
  return undefined;
}