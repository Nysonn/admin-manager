import type { DataProvider } from "react-admin";
import { pageHandlers } from "./handlers/pageHandlers";
import { imageHandlers } from "./handlers/imageHandlers";
import { menuHandlers } from "./handlers/menuHandlers";
import type { Page } from "../types";

// Re-export Page type for external use
export type { Page };

const dataProvider: DataProvider = {
  // --- GET LIST ---
  getList: (resource, params) => {
    if (resource === "pages") return pageHandlers.getList(params) as any;
    if (resource === "images") return imageHandlers.getList(params) as any;
    if (resource === "menu") return menuHandlers.getList() as any;
    return Promise.resolve({ data: [], total: 0 });
  },

  // --- GET ONE ---
  getOne: (resource, params) => {
    if (resource === "pages") return pageHandlers.getOne(params) as any;
    if (resource === "images") return imageHandlers.getOne(params) as any;
    if (resource === "menu") return menuHandlers.getOne(params) as any;
    throw new Error(`Unknown resource: ${resource}`);
  },

  // --- GET MANY ---
  getMany: (resource, params) => {
    if (resource === "pages") return pageHandlers.getMany(params) as any;
    if (resource === "images") return imageHandlers.getMany(params) as any;
    return Promise.resolve({ data: [] });
  },

  // --- GET MANY REFERENCE (Not implemented) ---
  getManyReference: (_resource, _params) => {
    return Promise.resolve({ data: [], total: 0 });
  },

  // --- CREATE ---
  create: (resource, params) => {
    if (resource === "pages") return pageHandlers.create(params) as any;
    if (resource === "images") return imageHandlers.create(params) as any;
    throw new Error(`Unknown resource: ${resource}`);
  },

  // --- UPDATE ---
  update: (resource, params) => {
    if (resource === "pages") return pageHandlers.update(params) as any;
    if (resource === "images") return imageHandlers.update(params) as any;
    if (resource === "menu") return menuHandlers.update(params) as any;
    throw new Error(`Unknown resource: ${resource}`);
  },

  // --- UPDATE MANY (Not implemented) ---
  updateMany: (_resource, _params) => {
    return Promise.resolve({ data: [] });
  },

  // --- DELETE ---
  delete: (resource, params) => {
    if (resource === "pages") return pageHandlers.delete(params) as any;
    if (resource === "images") return imageHandlers.delete(params) as any;
    throw new Error(`Unknown resource: ${resource}`);
  },

  // --- DELETE MANY ---
  deleteMany: (resource, params) => {
    if (resource === "pages") return pageHandlers.deleteMany(params) as any;
    if (resource === "images") return imageHandlers.deleteMany(params) as any;
    return Promise.resolve({ data: [] });
  },
};

export default dataProvider;