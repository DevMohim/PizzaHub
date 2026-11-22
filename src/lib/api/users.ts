import { apiFetch, withQuery } from "@/lib/api/client";
import type { IUser } from "@/types/user.type";

export interface UserQuery {
  [key: string]: string | undefined;
  search?: string;
  role?: string;
  status?: string;
}

// Admin: user list with optional name/email search, role and status filters
export const getAllUser = (token?: string, params: UserQuery = {}) =>
  apiFetch<IUser[]>(withQuery("/api/users", params), { token });

// Backend এ এই route email দিয়ে খোঁজে
export const getUserByEmail = async (email: string) => {
  return apiFetch<IUser>(`/api/users/${encodeURIComponent(email)}`);
};

// Logged-in user
export const getMyProfile = (token?: string) =>
  apiFetch<IUser>("/api/users/me", { token });
