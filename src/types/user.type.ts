export interface IUser {
  _id: Id;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  role: string;
}

export interface Id {
  $oid: string;
}

export interface CreatedAt {
  $date: string;
}

export interface UpdatedAt {
  $date: string;
}


export type UserRole = "vendor" | "customer" | "admin";

export type TSessionUser = {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string;
  name: string;
  role: UserRole;
};
