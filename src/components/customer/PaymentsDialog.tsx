"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api/orders";
import { useSession } from "@/lib/auth-client";
import type { CreateOrderInput } from "@/types/order.type";

export interface OrderFormErrors {
  deliveryDate?: string;
  deliveryAddress?: string;
}

interface PaymentsDialogProps {
  orderData: CreateOrderInput;
  itemName: string;
  price: number;
  onValidationFail: (errors: OrderFormErrors) => void;
}

const PaymentsDialog = ({
  orderData,
  itemName,
  price,
  onValidationFail,
}: PaymentsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleOpen = () => {
    const errors: OrderFormErrors = {};

    if (!orderData.deliveryDate?.trim()) {
      errors.deliveryDate = "Delivery date is required";
    }
    if (!orderData.deliveryAddress?.trim()) {
      errors.deliveryAddress = "Delivery address is required";
    }

    onValidationFail(errors);
    if (Object.keys(errors).length > 0) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (user.role !== "customer") {
      toast.error(`${user.role?.toUpperCase() ?? "User"} cannot place orders`);
      return;
    }

    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      await createOrder(orderData);
      toast.success("Order placed successfully. Waiting for vendor approval.");
      setOpen(false);
      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not place order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="lg"
        onClick={handleOpen}
        className="h-11 w-full cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
      >
        Place Order · ${price.toFixed(2)}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm your order</DialogTitle>
            <DialogDescription>
              Your order for {itemName} will be sent to the vendor for approval.
              Payment is not required at this step.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Delivery date: </span>
              {orderData.deliveryDate}
            </p>
            <p>
              <span className="text-muted-foreground">Address: </span>
              {orderData.deliveryAddress}
            </p>
            {orderData.message ? (
              <p>
                <span className="text-muted-foreground">Note: </span>
                {orderData.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-(image:--gradient-primary) text-white hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Placing order...
                </>
              ) : (
                "Confirm order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentsDialog;
