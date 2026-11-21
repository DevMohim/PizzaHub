const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createTransaction = async (
  token: string,
  vendorId: string
): Promise<{ url: string }> => {
  if (!BASE_URL) {
    throw new Error("Payment service is not configured.");
  }

  const res = await fetch(`${BASE_URL}/transactions/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan: "premium" , vendorId}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Checkout failed");
  }

  return data as { success: boolean; url: string };
};
