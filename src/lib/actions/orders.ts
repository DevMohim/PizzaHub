import { IOrder } from "@/types/order.type";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async(data:IOrder) => {
   if (!data) {
     throw new Error("Menu item data is required.");
   }

   try {
     const res = await fetch(`${BASE_URL}/orders`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(data),
     });

     if (!res.ok) {
       throw new Error(
         `Failed to create menu item. Server returned ${res.status} ${res.statusText}.`,
       );
     }

     return await res.json();
   } catch (error) {
     console.error("Create menu item failed:", error);

     // আসল error message/cause যেন caller পর্যন্ত পৌঁছায়
     throw new Error("Could not create menu item.", { cause: error });
   }

}