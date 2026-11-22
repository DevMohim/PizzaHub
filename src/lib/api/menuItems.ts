import { apiFetch, withQuery } from "@/lib/api/client";
import type { IMenuItem } from "@/types/menuItem.type";

export interface MenuItemsQuery {
  [key: string]: string | undefined;
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
}

// Public: token লাগে না
export const getMenuItems = async (query: MenuItemsQuery = {}) => {
  return apiFetch<IMenuItem[]>(withQuery("/api/menu-items", query), {
    auth: false,
  });
};

export const getFeaturedMenuItems = async () => {
  return apiFetch<IMenuItem[]>("/api/menu-items/featured", { auth: false });
};

// Login লাগে
export const getMenuItemsById = async (id: string ,token:string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch<IMenuItem>(`/api/menu-items/${id}` , {token});
};

// Vendor নিজের item
export const getMenuItemsByEmail = (token?: string) =>
  apiFetch<IMenuItem[]>("/api/menu-items/vendor/my", { token });

// Admin pending queue
export const getAdminMenuItems = (token?: string, status?: string) =>
  apiFetch<IMenuItem[]>(withQuery("/api/menu-items/admin/all", { status }), {
    token,
  });