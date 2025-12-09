import type { GetOneParams, UpdateParams } from "react-admin";
import { menuApi } from "../../api/endpoints";
import { normalizeResponse } from "../../utils/normalizeResponse";
import type { MenuItemType } from "../../pages/MenuPreview"; 

export type MenuData = {
    id: number;
    items: MenuItemType[]; 
};

const DEFAULT_MENU_ID = 1;

export const menuHandlers = {
  getList: async () => {
    try {
      // Assuming only one menu exists with a known ID (e.g., 1)
      const menu = await menuApi.get(DEFAULT_MENU_ID);
      const normalized = normalizeResponse(menu, DEFAULT_MENU_ID, "menu");

      return {
        data: [normalized] as MenuData[],
        total: 1,
      };
    } catch (error: any) {
      console.error("Error fetching menu:", error);
      // Fallback: return an empty menu structure
      return {
        data: [{ id: DEFAULT_MENU_ID, items: [] } as MenuData],
        total: 1,
      };
    }
  },

  getOne: async (params: GetOneParams) => {
    try {
      const data = await menuApi.get(Number(params.id));
      let normalized = normalizeResponse(data, params.id, "menu");
      
      // Ensure it has an items array if API doesn't guarantee it
      if (!normalized.items) {
          normalized = { ...normalized, items: [] };
      }
      
      return { data: normalized as MenuData };
    } catch (error: any) {
      console.error("Error fetching menu:", error);
      if (error.response?.status === 404) {
        throw new Error(`Menu with ID ${params.id} does not exist.`);
      }
      // Fallback on error
      return { data: { id: Number(params.id), items: [] } as MenuData };
    }
  },

  update: async (params: UpdateParams) => {
    try {
      const result = await menuApi.update(Number(params.id), { items: params.data.items });
      let normalized = normalizeResponse(result, params.id, "menu");
      
      // Ensure the return object has the updated items
      if (!normalized.items) {
          normalized = { ...normalized, items: params.data.items };
      }
      
      return { data: normalized as MenuData };
    } catch (error: any) {
      console.error("Error updating menu:", error);
      if (error.response?.status === 404) {
        throw new Error(`Menu with ID ${params.id} not found.`);
      }
      throw error;
    }
  },
};