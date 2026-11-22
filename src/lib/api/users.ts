import { apiFetch } from "@/lib/api/client";
import type { IUser } from "@/types/user.type";

// Admin: সব user (token apiFetch পাঠায়)
export const getAllUser = (token?: string) =>
  apiFetch<IUser[]>("/api/users", { token });

// Backend এ এই route email দিয়ে খোঁজে
export const getUserByEmail = async (email: string) => {
  return apiFetch<IUser>(`/api/users/${encodeURIComponent(email)}`);
};

// Logged-in user
export const getMyProfile = (token?: string) =>
  apiFetch<IUser>("/api/users/me", { token });
