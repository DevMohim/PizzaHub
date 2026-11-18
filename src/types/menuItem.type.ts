export interface IMenuItem {
  itemName: string;
  category: string | null;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  userEmail:string | undefined;
  userId:string | undefined
};