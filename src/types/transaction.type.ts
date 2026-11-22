export type TransactionStatus = "pending" | "paid" | "failed";

export interface ITransaction {
  _id: string;
  vendorId: string;
  vendorEmail?: string;
  plan: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  paidAt?: string;
  createdAt: string;
}
