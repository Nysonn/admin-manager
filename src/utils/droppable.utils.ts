/** Helper to get droppableId for a given parent path. We encode as 'root' or 'parent-{id}' */
export const droppableIdFor = (parentId: string | "root"): string => 
  parentId === "root" ? "root" : `parent-${parentId}`;

/** Helper to decode droppableId back to parentId */
export const parentIdFromDroppableId = (droppableId: string): string | "root" =>
  droppableId === "root" ? "root" : droppableId.replace(/^parent-/, "");