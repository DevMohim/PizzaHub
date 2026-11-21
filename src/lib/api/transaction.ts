const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getAllTransaction =async () => {
   try {
     const res = await fetch(`${BASE_URL}/transactions`);

     if (!res.ok) {
       throw new Error(
         `Failed to get transactions. Server returned ${res.status} ${res.statusText}.`,
       );
     }

     return await res.json();
   } catch (error) {
     console.error("Get transactions failed:", error);

     // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
     throw new Error("Could not get transactions.", { cause: error });
   }
}