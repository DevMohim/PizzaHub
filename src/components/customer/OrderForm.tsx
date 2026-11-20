"use client";
import { Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { IMenuItem } from "@/types/menuItem.type";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useState } from "react";
import AddToBagButton from "../browse/AddToBagButton";
import { useSession } from "@/lib/auth-client";
import PaymentsDialog, { OrderFormErrors } from "./PaymentsDialog";
import { cn } from "cn";

interface OrderFormType {
  item: IMenuItem;
}

const OrderForm = ({ item }: OrderFormType) => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const { data: session } = useSession();
  const user = session?.user;

  const totalAmount = quantity * Number(item.price ?? 0);

  const orderData = {
    itemId: item._id as string,
    itemName: item.itemName,
    itemImage: item.imageUrl,
    itemCategory: item.category ?? "",
    vendorName: item.userEmail ?? "",
    price: Number(item.price ?? 0),
    quantity,
    totalAmount,
    deliveryDate,
    deliveryAddress,
    message,
    userName: user?.name ?? "",
    userEmail: user?.email ?? "",
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
        <ShoppingBag className="text-primary size-5" aria-hidden="true" />
        Place an Order
      </h2>

      <div className="mt-4 space-y-4">
        <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex h-10 w-36 items-center justify-between rounded-lg border border-input px-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
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
                onClick={() => setQuantity((q) => q + 1)}
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
              onChange={(e) => {
                setDeliveryDate(e.target.value);
                setErrors((prev) => ({ ...prev, deliveryDate: undefined }));
              }}
              min={new Date().toISOString().slice(0, 10)}
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

          <PaymentsDialog orderData={orderData} onValidationFail={setErrors} />
        </form>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs">
            Not ready to order yet? Keep it in your bag.
          </p>
          <AddToBagButton
            user={user}
            item={{
              id: item._id as string,
              itemName: item.itemName,
              price: Number(item.price ?? 0),
              imageUrl: item.imageUrl ?? "",
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
