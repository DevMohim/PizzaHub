const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const blockUser = async (id: string) => {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const res = await fetch(`${BASE_URL}/users/${id}/block`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to block user. Server returned ${res.status} ${res.statusText}.`,
    );
  }

  // Backend 204 পাঠালে JSON parse করার চেষ্টা করবে না
  if (res.status === 204) return null;

  return res.json();
};


export const unBlockedUser = async(id:string) => {
   if (!id) {
     throw new Error("User id is required.");
   }

   try {
     const res = await fetch(`${BASE_URL}/users/${id}/unBlock`, {
       method: "PATCH",
     });

     if (!res.ok) {
       throw new Error(
         `Failed to update user info. Server returned ${res.status} ${res.statusText}.`,
       );
     }

     return await res.json();
   } catch (error) {
     console.error("Update user info failed:", error);

     // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
     throw new Error("Could not update user info.", { cause: error });
   }
}