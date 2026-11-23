"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreditCard, Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/lib/actions/orders";
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

type CardField = "name" | "number" | "expiry" | "cvc";
type CardErrors = Partial<Record<CardField, string>>;

const EMPTY_CARD = { name: "", number: "", expiry: "", cvc: "" };

// Demo formatting only — the values are never sent anywhere.
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500">{message}</p> : null;

const PaymentsDialog = ({
  orderData,
  itemName,
  price,
  onValidationFail,
}: PaymentsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [card, setCard] = useState(EMPTY_CARD);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
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
      router.push("/login");
      return;
    }

    if (user.role !== "customer") {
      toast.error(`${user.role?.toUpperCase() ?? "User"} cannot place orders`);
      return;
    }

    setOpen(true);
  };

  const updateCard = (field: CardField, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    setCardErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateCard = () => {
    const errors: CardErrors = {};
    if (!card.name.trim()) errors.name = "Name on card is required";
    if (!card.number.replace(/\s/g, "")) errors.number = "Card number is required";
    if (!card.expiry.trim()) errors.expiry = "Expiry is required";
    if (!card.cvc.trim()) errors.cvc = "CVC is required";

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateCard()) return;

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
            <div className="flex items-center justify-between pr-6">
              <DialogTitle>Checkout</DialogTitle>
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              >
                Test mode
              </Badge>
            </div>
            <DialogDescription>
              Demo checkout — no real payment will be processed.
            </DialogDescription>
          </DialogHeader>

          {/* Order summary */}
          <div className="bg-muted/40 rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-sm font-semibold">{itemName}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Delivery order
                </p>
              </div>
              <p className="font-heading text-base font-bold tabular-nums">
                ${price.toFixed(2)}
              </p>
            </div>

            <Separator className="my-3" />

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground shrink-0">Delivery date</dt>
                <dd className="text-right font-medium">
                  {orderData.deliveryDate || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground shrink-0">Address</dt>
                <dd className="text-right font-medium">
                  {orderData.deliveryAddress || "—"}
                </dd>
              </div>
              {orderData.message ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground shrink-0">Note</dt>
                  <dd className="text-right font-medium">{orderData.message}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Payment (demo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="size-4" aria-hidden="true" />
                Pay with card
              </p>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="px-1.5 text-[10px]">
                  VISA
                </Badge>
                <Badge variant="outline" className="px-1.5 text-[10px]">
                  MC
                </Badge>
                <Badge variant="outline" className="px-1.5 text-[10px]">
                  AMEX
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card-name">Name on card</Label>
              <Input
                id="card-name"
                name="cardName"
                autoComplete="cc-name"
                placeholder="Full name on card"
                className="h-10"
                aria-invalid={!!cardErrors.name}
                value={card.name}
                onChange={(e) => updateCard("name", e.target.value)}
              />
              <FieldError message={cardErrors.name} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card-number">Card number</Label>
              <Input
                id="card-number"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                className="h-10"
                aria-invalid={!!cardErrors.number}
                value={card.number}
                onChange={(e) =>
                  updateCard("number", formatCardNumber(e.target.value))
                }
              />
              <FieldError message={cardErrors.number} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-expiry">Expiry</Label>
                <Input
                  id="card-expiry"
                  name="cardExpiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  className="h-10"
                  aria-invalid={!!cardErrors.expiry}
                  value={card.expiry}
                  onChange={(e) =>
                    updateCard("expiry", formatExpiry(e.target.value))
                  }
                />
                <FieldError message={cardErrors.expiry} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  name="cardCvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  maxLength={4}
                  className="h-10"
                  aria-invalid={!!cardErrors.cvc}
                  value={card.cvc}
                  onChange={(e) =>
                    updateCard("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                />
                <FieldError message={cardErrors.cvc} />
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-muted-foreground text-xs">Total</span>
              <span className="font-heading text-lg font-bold tabular-nums">
                ${price.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2">
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="size-4" aria-hidden="true" />
                    Pay ${price.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentsDialog;