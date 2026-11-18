/** Review/publish lifecycle of a menu item. */
export type MenuItemStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive";

export interface IMenuItem {
  _id?: string;
  itemName: string;
  category: string | null;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  userEmail: string | undefined;
  userId: string | undefined;
  /** Set by the backend on create ("pending") and by admin review. */
  status?: MenuItemStatus;
}
