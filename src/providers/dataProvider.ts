import type { DataProvider } from "react-admin";
import { pagesApi, imagesApi, menuApi } from "../api/endpoints";

export type Page = {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

const dataProvider: DataProvider = {
  // Pages
  getList: async (resource, params) => {
    if (resource === "pages") {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field = "id", order = "ASC" } = params.sort || {};
      const filters = params.filter || {};

      const response = await pagesApi.getAll({
        page,
        perPage,
        _sort: field,
        _order: order.toLowerCase() as "asc" | "desc",
        q: filters.q,
        status: filters.status,
        slug: filters.slug,
      });

      return {
        data: response.data,
        total: response.total,
      };
    }

    if (resource === "images") {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const filters = params.filter || {};

      const response = await imagesApi.getAll({
        page,
        perPage,
        q: filters.q,
      });

      return {
        data: response.data,
        total: response.total,
      };
    }

    if (resource === "menu") {
      try {
        const menu = await menuApi.get(1);
        return {
          data: [menu] as any,
          total: 1,
        };
      } catch (error: any) {
        console.error("Error fetching menu:", error);
        // Return empty menu structure if fetch fails
        return {
          data: [{ id: 1, items: [] }],
          total: 1,
        };
      }
    }

    return { data: [], total: 0 };
  },

  getOne: async (resource, params) => {
    if (resource === "pages") {
      try {
        const response = await pagesApi.getOne(Number(params.id));
        
        // Normalize response - handle wrapped data
        let normalized: any = response as any;
        if (normalized && typeof normalized === "object") {
          // Unwrap if response is like { data: {...} } or { page: {...} }
          if (!normalized.id && normalized.data && normalized.data.id) {
            normalized = normalized.data;
          } else if (!normalized.id && normalized.page && normalized.page.id) {
            normalized = normalized.page;
          }
        }
        
        // Ensure id is present
        if (!normalized?.id) {
          normalized = { ...normalized, id: params.id };
        }
        
        return { data: normalized as any };
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Page with ID ${params.id} does not exist or has been deleted.`);
        }
        throw error;
      }
    }

    if (resource === "images") {
      try {
        const response = await imagesApi.getOne(Number(params.id));
        
        // Normalize response
        let normalized: any = response as any;
        if (normalized && typeof normalized === "object") {
          if (!normalized.id && normalized.data && normalized.data.id) {
            normalized = normalized.data;
          } else if (!normalized.id && normalized.image && normalized.image.id) {
            normalized = normalized.image;
          }
        }
        
        // Ensure id is present
        if (!normalized?.id) {
          normalized = { ...normalized, id: params.id };
        }
        
        return { data: normalized as any };
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Image with ID ${params.id} does not exist or has been deleted.`);
        }
        throw error;
      }
    }

    if (resource === "menu") {
      try {
        const data = await menuApi.get(Number(params.id));
        // Normalize response - ensure it has items array
        let normalized: any = data as any;
        if (normalized && typeof normalized === "object") {
          if (!normalized.items) {
            normalized = { ...normalized, items: [] };
          }
          if (!normalized.id) {
            normalized = { ...normalized, id: params.id };
          }
        }
        return { data: normalized as any };
      } catch (error: any) {
        console.error("Error fetching menu:", error);
        if (error.response?.status === 404) {
          throw new Error(`Menu with ID ${params.id} does not exist.`);
        }
        // Return empty menu structure on error
        return { data: { id: Number(params.id), items: [] } as any };
      }
    }

    throw new Error(`Unknown resource: ${resource}`);
  },

  getMany: async (resource, params) => {
    if (resource === "pages") {
      const promises = params.ids.map((id) => pagesApi.getOne(Number(id)));
      const data = await Promise.all(promises);
      return { data: data as any };
    }

    if (resource === "images") {
      const promises = params.ids.map((id) => imagesApi.getOne(Number(id)));
      const data = await Promise.all(promises);
      return { data: data as any };
    }

    return { data: [] };
  },

  getManyReference: async (_resource, _params) => {
    // Not implemented for this use case
    return { data: [], total: 0 };
  },

  create: async (resource, params) => {
    if (resource === "pages") {
      const created = await pagesApi.create(params.data as any);
      // Some backends may not return a top-level id; normalize response
      let normalized: any = created as any;
      if (normalized && typeof normalized === "object") {
        // handle possible wrappers like { data: {...} } or { page: {...} }
        if (!normalized.id && normalized.data && normalized.data.id) {
          normalized = normalized.data;
        } else if (!normalized.id && normalized.page && normalized.page.id) {
          normalized = normalized.page;
        }
      }
      // Fallback: if id is still missing, try to fetch by slug to obtain id
      if (!normalized?.id && params.data?.slug) {
        try {
          const res = await pagesApi.getAll({ page: 1, perPage: 1, _sort: "id", _order: "asc", slug: params.data.slug });
          const match = Array.isArray(res.data) ? res.data.find((p: any) => p?.slug === params.data.slug) : undefined;
          if (match) normalized = match;
        } catch {}
      }
      if (!normalized?.id) {
        // As a last resort, ensure React Admin gets an id to avoid crashing
        // Generate a placeholder id (backend should ideally return one)
        normalized = { id: Date.now(), ...(params.data as any), ...normalized };
      }
      return { data: normalized as any };
    }

    if (resource === "images") {
      const file = params.data.file?.rawFile;
      if (!file) {
        throw new Error("No file provided");
      }
      const data = await imagesApi.upload(file);
      return { data: data as any };
    }

    throw new Error(`Unknown resource: ${resource}`);
  },

  update: async (resource, params) => {
    if (resource === "pages") {
      try {
        // Send all fields as per API spec (Postman collection)
        const { title, slug, content, status } = params.data;
        const data = await pagesApi.update(Number(params.id), { title, slug, content, status });
        
        // Normalize response similar to create
        let normalized: any = data as any;
        if (normalized && typeof normalized === "object") {
          if (!normalized.id && normalized.data && normalized.data.id) {
            normalized = normalized.data;
          } else if (!normalized.id && normalized.page && normalized.page.id) {
            normalized = normalized.page;
          }
        }
        
        // Ensure id is present
        if (!normalized?.id) {
          normalized = { ...normalized, id: params.id };
        }
        
        return { data: normalized as any };
      } catch (error: any) {
        // Handle 404 specifically - the page might have been deleted
        if (error.response?.status === 404) {
          throw new Error(`Page with ID ${params.id} not found. It may have been deleted.`);
        }
        throw error;
      }
    }

    if (resource === "images") {
      try {
        const file = params.data.file?.rawFile;
        if (!file) {
          throw new Error("No file provided");
        }
        const response = await imagesApi.update(Number(params.id), file);
        
        // Normalize response
        let normalized: any = response as any;
        if (normalized && typeof normalized === "object") {
          if (!normalized.id && normalized.data && normalized.data.id) {
            normalized = normalized.data;
          } else if (!normalized.id && normalized.image && normalized.image.id) {
            normalized = normalized.image;
          }
        }
        
        // Ensure id is present
        if (!normalized?.id) {
          normalized = { ...normalized, id: params.id };
        }
        
        return { data: normalized as any };
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Image with ID ${params.id} not found. It may have been deleted.`);
        }
        throw error;
      }
    }

    if (resource === "menu") {
      try {
        const result = await menuApi.update(Number(params.id), { items: params.data.items });
        // Normalize response - ensure it has proper structure
        let normalized: any = result as any;
        if (normalized && typeof normalized === "object") {
          if (!normalized.items) {
            normalized = { ...normalized, items: params.data.items };
          }
          if (!normalized.id) {
            normalized = { ...normalized, id: params.id };
          }
        }
        return { data: normalized as any };
      } catch (error: any) {
        console.error("Error updating menu:", error);
        if (error.response?.status === 404) {
          throw new Error(`Menu with ID ${params.id} not found.`);
        }
        throw error;
      }
    }

    throw new Error(`Unknown resource: ${resource}`);
  },

  updateMany: async (_resource, _params) => {
    // Not implemented for this use case
    return { data: [] };
  },

  delete: async (resource, params) => {
    if (resource === "pages") {
      await pagesApi.delete(Number(params.id));
      return { data: { id: params.id } as any };
    }

    if (resource === "images") {
      await imagesApi.delete(Number(params.id));
      return { data: { id: params.id } as any };
    }

    throw new Error(`Unknown resource: ${resource}`);
  },

  deleteMany: async (resource, params) => {
    if (resource === "pages") {
      await Promise.all(params.ids.map((id) => pagesApi.delete(Number(id))));
      return { data: params.ids };
    }

    if (resource === "images") {
      await Promise.all(params.ids.map((id) => imagesApi.delete(Number(id))));
      return { data: params.ids };
    }

    return { data: [] };
  },
};

export default dataProvider;
