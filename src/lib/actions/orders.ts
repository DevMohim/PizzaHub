import { apiFetch } from "@/lib/api/client";
import type { CreateOrderInput } from "@/types/order.type";

// Customer: নতুন order তৈরি (POST)
export const createOrder = async (data: CreateOrderInput) => {
  if (!data) throw new Error("Order data is required.");

  return apiFetch<{ message: string; insertedId: string }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Customer: নিজের pending order cancel (DELETE)
export const cancelOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch<{ message: string }>(`/api/orders/${id}/cancel`, {
    method: "DELETE",
  });
};

// ---------- Vendor ----------

export const updateAcceptedOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch<{ message: string }>(`/api/orders/${id}/accept`, {
    method: "PATCH",
  });
};

export const updateRejectOrder = async (id: string) => {
  if (!id) throw new Error("Order id is required.");

  return apiFetch<{ message: string }>(`/api/orders/${id}/reject`, {
    method: "PATCH",
  });
};