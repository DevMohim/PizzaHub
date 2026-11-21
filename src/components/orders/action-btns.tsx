"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Check, X } from "lucide-react";
import { IOrder, OrderStatus } from "@/types/order.type";
import { updateAcceptedOrder } from "@/lib/actions/orders";
import { Button } from "../ui/button";



type ActionBtnsProps = {
  order: IOrder;
  onStatusChange?: (id: string, status: OrderStatus) => void;
};

export function ActionBtns({ order, onStatusChange }: ActionBtnsProps) {
  const [busy, setBusy] = useState<"accepted" | "rejected" | null>(null);

  // শুধু pending order-এ Accept/Reject দেখাবে
  if (order.status !== "pending" || !order._id) return null;

  const handleUpdate = async (status: "accepted" | "rejected") => {
    setBusy(status);
    try {
      await updateAcceptedOrder(order._id as string);
      toast.success(
        status === "accepted" ? "Order accepted" : "Order rejected",
      );
      onStatusChange?.(order._id as string, status);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="border-destructive/40 text-destructive hover:bg-destructive/10"
        disabled={busy !== null}
        onClick={() => handleUpdate("rejected")}
      >
        <X className="size-4" aria-hidden="true" />
        {busy === "rejected" ? "Rejecting..." : "Reject"}
      </Button>
      <Button
        size="sm"
        className="bg-success text-white hover:bg-success/90"
        disabled={busy !== null}
        onClick={() => handleUpdate("accepted")}
      >
        <Check className="size-4" aria-hidden="true" />
        {busy === "accepted" ? "Accepting..." : "Accept"}
      </Button>
    </div>
  );
}
