"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "cn";
import { buttonVariants } from "../ui/button";
import { ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createOrder } from "@/lib/actions/orders";
import { IOrder } from "@/types/order.type";

export interface OrderFormErrors {
  deliveryDate?: string;
  deliveryAddress?: string;
}

interface DialogProps {
  orderData: IOrder;
  onValidationFail: (errors: OrderFormErrors) => void;
}

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 outline-none transition-shadow " +
  "focus:border-transparent focus:ring-2 focus:ring-[#635bff]/40";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const PaymentsDialog = ({ orderData, onValidationFail }: DialogProps) => {
  const [open, setOpen] = useState(false);
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

    if (Object.keys(errors).length > 0) {
      onValidationFail(errors);
      return;
    }

    onValidationFail({});
    setOpen(true);
  };

  const handleOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "vendor" || user.role === "admin") {
      toast.error(`${user.role.toUpperCase()} isn't able to order items`);
      return;
    }

    await createOrder(orderData);
    toast.success("Payment Successful, your order is confirmed");
    setOpen(false);
    router.push(`/dashboard/customer/orders`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 w-full bg-(image:--gradient-primary) text-white hover:opacity-90 cursor-pointer",
        )}
      >
        Order Now ${orderData.totalAmount}
      </button>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b bg-muted/40 px-6 py-5 text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              Pay with card
            </DialogTitle>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            ${orderData.totalAmount.toFixed(2)}
          </p>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="card-number" className={labelClass}>
              Card number
            </label>
            <div className="relative">
              <input
                id="card-number"
                inputMode="numeric"
                autoComplete="off"
                placeholder="1234 1234 1234 1234"
                className={cn(inputClass, "pr-24")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="card-name" className={labelClass}>
              Card Holder Name
            </label>
            <input
              id="card-name"
              autoComplete="off"
              placeholder="Full name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="card-expiry" className={labelClass}>
                Expiry Date
              </label>
              <input
                id="card-expiry"
                inputMode="numeric"
                autoComplete="off"
                placeholder="MM / YY"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="card-cvc" className={labelClass}>
                CVC
              </label>
              <input
                id="card-cvc"
                inputMode="numeric"
                autoComplete="off"
                placeholder="123"
                maxLength={4}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full bg-(image:--gradient-primary) text-white hover:opacity-90 cursor-pointer",
            )}
          >
            Pay Now ${orderData.totalAmount.toFixed(2)}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Payments are encrypted and processed securely
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentsDialog;
