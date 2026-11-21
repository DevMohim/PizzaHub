export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface IOrder {
  _id?: string
  itemId: string;
  itemName: string;
  itemImage: string;
  itemCategory: string;
  vendorEmail: string;
  price: number;
  quantity: number;
  totalAmount: number;
  deliveryDate: string; // YYYY-MM-DD
  deliveryAddress: string;
  message: string;
  userName: string;
  userEmail: string;
  status?: OrderStatus;
  requestedAt?: {
    $date: string; // ISO date-time
  };
}
