import { apiFetch } from "@/lib/api/client";

// Admin
export const blockUser = async (id: string) => {
  if (!id) throw new Error("User ID is required.");

  return apiFetch(`/api/users/${id}/block`, { method: "PATCH" });
};

export const unBlockedUser = async (id: string) => {
  if (!id) throw new Error("User id is required.");

  return apiFetch(`/api/users/${id}/unBlock`, { method: "PATCH" });
};
