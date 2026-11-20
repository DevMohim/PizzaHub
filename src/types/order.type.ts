export interface IOrder {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  userName: string;
  userEmail: string;
}