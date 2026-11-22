import { apiFetch } from "@/lib/api/client";
import { ITransaction } from "@/types/transaction.type";

// Admin: read-only
export const getAllTransaction = (token?: string) =>
  apiFetch<ITransaction[]>("/api/transactions", { token });
