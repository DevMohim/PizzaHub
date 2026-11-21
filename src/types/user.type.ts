

export type UserRole = "vendor" | "customer" | "admin" ;

export type TSessionUser = {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string;
  name: string;
  role: UserRole;
  isPremium?:boolean
};

export interface IUser{
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string; // ISO date string from JSON
  updatedAt: string; // ISO date string from JSON
  role: "vendor" | "admin" | "customer";
  status: string;
  isBlocked?: boolean
  isPremium?:boolean
};