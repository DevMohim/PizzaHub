import { IMenuItem } from "@/types/menuItem.type";
import { apiFetch } from "@/lib/api/client";

export const createMenuItem = async (data: IMenuItem) => {
  if (!data) throw new Error("Menu item data is required.");

  return apiFetch("/api/menu-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMenuItem = async (id: string, data: IMenuItem) => {
  if (!id) throw new Error("Menu item id is required.");
  if (!data) throw new Error("Update data is required.");

  return apiFetch(`/api/menu-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteMenuItem = async (id: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch(`/api/menu-items/${id}`, { method: "DELETE" });
};

export const updateApproveStatus = async (id: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch(`/api/menu-items/${id}/approve`, { method: "PATCH" });
};

export const updateRejectStatus = async (id: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch(`/api/menu-items/${id}/reject`, { method: "PATCH" });
};

export const updateInactiveStatus = async (id: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch(`/api/menu-items/${id}/inactive`, { method: "PATCH" });
};

export const updateActiveStatus = async (id: string) => {
  if (!id) throw new Error("Menu item id is required.");

  return apiFetch(`/api/menu-items/${id}/active`, { method: "PATCH" });
};
