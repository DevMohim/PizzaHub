const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOrdersByEmail = async(email:string) => {
   if (!email) {
     throw new Error("User email is required.");
   }

   try {
     const res = await fetch(`${BASE_URL}/orders?email=${email}`);

     if (!res.ok) {
       throw new Error(
         `Failed to get orders. Server returned ${res.status} ${res.statusText}.`,
       );
     }

     return await res.json();
   } catch (error) {
     console.error("Get orders failed:", error);

     // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
     throw new Error("Could not get orders.", { cause: error });
   }
}