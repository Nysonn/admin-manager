import type { MenuItemType } from '../types/menu.types';

export const DEFAULT_NEW_ITEM = (): MenuItemType => ({
  id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  label: "New item",
  linkType: "none",
  pageId: null,
  url: null,
  icon: null,
  openInNewTab: false,
  showInMobile: true,
  children: [],
});