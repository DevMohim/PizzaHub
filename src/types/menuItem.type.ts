export const MENU_CATEGORIES = [
  "classic-pizzas",
  "vegetarian-pizzas",
  "meat-lovers",
  "specialty-gourmet-pizzas",
  "sides-appetizers",
  "beverages-desserts",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

// Backend এ inactive আলাদা status নয়। Approved item এর active:false মানে inactive।
export type MenuItemStatus = "pending" | "approved" | "rejected";

export interface IMenuItem {
  _id: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorId: string;
  vendorEmail?: string;
  vendorName?: string;
  status: MenuItemStatus;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type MenuItemInput = Pick<
  IMenuItem,
  "itemName" | "category" | "description" | "price" | "location" | "images"
>;
