import { IOrder } from "@/types/order.type";
import { apiFetch } from "@/lib/api/client";

export const createOrder = async (data: IOrder) => {
  if (!data) throw new Error("Order data is required.");

  return apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Customer: নিজের pending order cancel
export const cancelOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH" });
};

// Vendor
export const updateAcceptedOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch(`/api/orders/${id}/accept`, { method: "PATCH" });
};

export const updateRejectOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch(`/api/orders/${id}/reject`, { method: "PATCH" });
};
