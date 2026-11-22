"use client";

import { useState } from "react";
import { Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IMenuItem } from "@/types/menuItem.type";
import type { CreateOrderInput } from "@/types/order.type";
import AddToBagButton from "@/components/browse/AddToBagButton";
import PaymentsDialog, {
  type OrderFormErrors,
} from "@/components/customer/PaymentsDialog";
import { useSession } from "@/lib/auth-client";

interface OrderFormProps {
  item: IMenuItem;
}

const OrderForm = ({ item }: OrderFormProps) => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const { data: session } = useSession();
  const user = session?.user;

  const price = Number(item.price ?? 0);
  const image = item.images?.[0] ?? "";
  const totalAmount = quantity * price;

  // Backend শুধু এই চারটি field নেয়
  const orderData: CreateOrderInput = {
    itemId: item._id,
    deliveryDate,
    deliveryAddress: deliveryAddress.trim(),
    message: message.trim(),
  };

  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-xs">
      <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
        <ShoppingBag className="text-primary size-5" aria-hidden="true" />
        Place an Order
      </h2>

      <div className="mt-4 space-y-4">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Quantity: শুধু UI, backend এখনো এক order এ এক item নেয় */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="border-input flex h-10 w-36 items-center justify-between rounded-lg border px-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="text-sm font-medium tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Delivery date */}
          <div className="space-y-2">
            <Label htmlFor="delivery-date">Delivery Date</Label>
            <Input
              id="delivery-date"
              name="deliveryDate"
              type="date"
              className={cn(
                "h-10",
                errors.deliveryDate &&
                  "border-red-500 focus-visible:ring-red-500/30",
              )}
              aria-invalid={!!errors.deliveryDate}
              value={deliveryDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                setDeliveryDate(e.target.value);
                setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
              }}
            />
            {errors.deliveryDate && (
              <p className="text-sm text-red-500">{errors.deliveryDate}</p>
            )}
          </div>

          {/* Delivery address */}
          <div className="space-y-2">
            <Label htmlFor="delivery-address">Delivery Address</Label>
            <Textarea
              id="delivery-address"
              name="deliveryAddress"
              placeholder="House, road, area, city…"
              className={cn(
                "min-h-20",
                errors.deliveryAddress &&
                  "border-red-500 focus-visible:ring-red-500/30",
              )}
              aria-invalid={!!errors.deliveryAddress}
              value={deliveryAddress}
              onChange={(e) => {
                setDeliveryAddress(e.target.value);
                setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
              }}
            />
            {errors.deliveryAddress && (
              <p className="text-sm text-red-500">{errors.deliveryAddress}</p>
            )}
          </div>

          {/* Optional message */}
          <div className="space-y-2">
            <Label htmlFor="order-message">
              Message / Special Instructions{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="order-message"
              name="message"
              placeholder="Extra spicy, no onions…"
              className="min-h-16"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <PaymentsDialog
            orderData={orderData}
            itemName={item.itemName}
            price={totalAmount}
            onValidationFail={setErrors}
          />
        </form>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs">
            Not ready to order yet? Keep it in your bag.
          </p>
          <AddToBagButton
            user={
              user
                ? {
                    ...user,
                    status: user.isBlocked ? "blocked" : "active",
                  }
                : undefined
            }
            item={{
              id: item._id,
              itemName: item.itemName,
              price,
              imageUrl: image,
              location: item.location,
            }}
          />
        </div>

        <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
          <ShieldCheck
            className="mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          />
          You&apos;ll be asked to sign in before your order is placed.
        </p>
      </div>
    </section>
  );
};

export default OrderForm;
