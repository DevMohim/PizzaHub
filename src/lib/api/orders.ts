import { apiFetch, withQuery } from "./client";
import type { CreateOrderInput, IOrder, OrderStatus } from "@/types/order.type";

// ---------- Customer ----------

export const createOrder = (data: CreateOrderInput, token?: string) =>
  apiFetch<{ message: string; insertedId: string }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

// Customer: নিজের সব order (newest first)
export const getMyOrders = (token?: string) =>
  apiFetch<IOrder[]>("/api/orders/my", { token });

// Customer: নিজের pending order cancel
export const cancelOrder = (id: string, token?: string) =>
  apiFetch<{ message: string }>(`/api/orders/${id}/cancel`, {
    method: "PATCH",
    token,
  });

// ---------- Vendor ----------

// Vendor: নিজের item এর order
export const getOrdersByVendorEmail = (token?: string) =>
  apiFetch<IOrder[]>("/api/orders/vendor", { token });

export const updateAcceptedOrder = (id: string, token?: string) =>
  apiFetch<{ message: string }>(`/api/orders/${id}/accept`, {
    method: "PATCH",
    token,
  });

export const updateRejectOrder = (id: string, token?: string) =>
  apiFetch<{ message: string }>(`/api/orders/${id}/reject`, {
    method: "PATCH",
    token,
  });

// ---------- Admin ----------

export const getAdminOrders = (token?: string, status?: OrderStatus) =>
  apiFetch<IOrder[]>(withQuery("/api/orders/admin", { status }), { token });
