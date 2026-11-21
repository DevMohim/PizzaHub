/** A MongoDB date value as returned by the API (plain ISO or extended JSON). */
export type MongoDateValue = string | { $date: string };

/** A MongoDB ObjectId as returned by the API (plain hex or extended JSON). */
export type MongoObjectId = string | { $oid: string };

/** Vendor fields that may be embedded when the API populates `vendorId`. */
export interface ITransactionVendor {
  $oid?: string;
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
}

export interface ITransaction {
  _id: MongoObjectId;
  vendorId: MongoObjectId | ITransactionVendor;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: MongoDateValue;
  stripeSessionId?: string;
  paidAt?: MongoDateValue;
  stripeSubscriptionId?: string;
}
