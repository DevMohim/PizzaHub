export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface IOrder {
  _id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  vendorId: string;
  vendorName?: string;
  vendorEmail?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string; // ISO date string
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string; // ISO date string
  updatedAt?: string;
  respondedAt?: string;
}

export interface CreateOrderInput {
  itemId: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryAddress: string;
  message?: string;
}
