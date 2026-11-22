import { apiFetch } from "@/lib/api/client";

// Vendor: Premium checkout। token apiFetch নিজেই পাঠায়।
export const createTransaction = async (): Promise<{ success: boolean; url: string }> => {
  return apiFetch("/api/transactions/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ plan: "premium" }),
  });
};
