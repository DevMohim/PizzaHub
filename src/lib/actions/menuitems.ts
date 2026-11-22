"use server";

import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { apiFetch } from "@/lib/api/client";
import type { MenuItemInput } from "@/types/menuItem.type";

const requireToken = async () => {
  const token = await getTokenFromServer();
  if (!token) throw new Error("Login করা নেই। আবার sign in করুন।");
  return token;
};

// ---------- Vendor ----------

export const createMenuItem = async (data: MenuItemInput) => {
  const token = await requireToken();
  return apiFetch<{ message: string; insertedId: string }>("/api/menu-items", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
};

export const updateMenuItem = async (id: string, data: MenuItemInput) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });
};

export const deleteMenuItem = async (id: string) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}`, {
    method: "DELETE",
    token,
  });
};

export const updateActiveStatus = async (id: string) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}/active`, {
    method: "PATCH",
    token,
  });
};

export const updateInactiveStatus = async (id: string) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}/inactive`, {
    method: "PATCH",
    token,
  });
};

// ---------- Admin ----------

export const updateApproveStatus = async (id: string) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}/approve`, {
    method: "PATCH",
    token,
  });
};

export const updateRejectStatus = async (id: string) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}/reject`, {
    method: "PATCH",
    token,
  });
};

export const moderateMenuItem = async (
  id: string,
  status: "approved" | "rejected" | "inactive",
) => {
  const token = await requireToken();
  return apiFetch<{ message: string }>(`/api/menu-items/${id}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    token,
  });
};
