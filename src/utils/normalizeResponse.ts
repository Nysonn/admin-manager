import type { Identifier } from "react-admin";

/**
 * Standardizes an API response object for React Admin compatibility.
 * This handles common API response structures where the actual data
 * might be wrapped (e.g., { data: { id: 1 } } or { page: { id: 1 } }).
 * It also ensures the resulting object has an 'id' property.
 * * @param response The raw response from the API.
 * @param requestedId The ID used in the request, for fallback.
 * @param resource The resource type (used to guess wrapper key, e.g., 'pages' -> 'page').
 * @returns The normalized data object.
 */
export function normalizeResponse(response: any, requestedId?: Identifier, resource?: string): any {
  if (!response || typeof response !== "object") {
    return { id: requestedId, ...response };
  }

  let normalized = response;
  
  // 1. Check for common wrappers: { data: {...} }
  if (!normalized.id && normalized.data && normalized.data.id) {
    normalized = normalized.data;
  } 
  
  // 2. Check for resource-specific wrappers (e.g., { page: {...} }, { image: {...} })
  if (resource) {
    const key = resource.slice(0, -1); // e.g., 'pages' -> 'page'
    if (!normalized.id && normalized[key] && normalized[key].id) {
      normalized = normalized[key];
    }
  }

  // 3. Ensure ID is present
  if (!normalized?.id) {
    normalized = { ...normalized, id: requestedId };
  }

  return normalized;
}