

export type UserRole = "vendor" | "customer" ;

export type TSessionUser = {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string;
  name: string;
  role: UserRole;
};

export interface IUser{
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string; // ISO date string from JSON
  updatedAt: string; // ISO date string from JSON
  role: "vendor" | "admin";
  isBlocked?: boolean
};