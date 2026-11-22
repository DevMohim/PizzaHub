import { apiFetch, withQuery } from "@/lib/api/client";
import type { IMenuItem } from "@/types/menuItem.type";

export interface MenuItemsQuery {
  [key: string]: string | undefined;
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
}

export interface AdminMenuItemsQuery {
  [key: string]: string | undefined;
  search?: string;
  status?: string;
  category?: string;
  vendor?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export interface AdminMenuItemsResponse {
  items: IMenuItem[];
  total: number;
  page: number;
  limit: number;
}

export interface VendorOption {
  value: string;
  label: string;
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
export const getMenuItemsById = async (id: string, token?: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch<IMenuItem>(`/api/menu-items/${id}`, { token });
};

// Vendor নিজের item
export const getMenuItemsByEmail = (token?: string) =>
  apiFetch<IMenuItem[]>("/api/menu-items/vendor/my", { token });

// Admin: filter, sort, pagination সহ item list
export const getAdminMenuItems = (
  params: AdminMenuItemsQuery = {},
  token?: string,
) =>
  apiFetch<AdminMenuItemsResponse>(
    withQuery("/api/menu-items/admin/all", params),
    { token },
  );

// Admin: vendor dropdown এর জন্য
export const getAdminVendors = (token?: string) =>
  apiFetch<VendorOption[]>("/api/menu-items/admin/vendors", { token });
