import { apiFetch, withQuery } from "./client";
import type { IOrder, OrderStatus } from "@/types/order.type";

// ---------- Customer ----------

// Customer: নিজের সব order (newest first)
export const getMyOrders = (token?: string) =>
  apiFetch<IOrder[]>("/api/orders/my", { token });

// ---------- Vendor ----------

// Vendor: নিজের item এর order
export const getOrdersByVendorEmail = (token?: string) =>
  apiFetch<IOrder[]>("/api/orders/vendor", { token });

// ---------- Admin ----------

export const getAdminOrders = (token?: string, status?: OrderStatus) =>
  apiFetch<IOrder[]>(withQuery("/api/orders/admin", { status }), { token });