"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";

import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { cn } from "cn";
import { StripEmptyObjects } from "better-auth";

interface AddToBagButtonProps {
  item: {
    id: string;
    itemName: string;
    price: number;
    imageUrl: string;
    location: string;
  };
  user:
    | StripEmptyObjects<
        {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          email: string;
          emailVerified: boolean;
          name: string;
          image?: string | null | undefined;
        } & {
          role: string | null | undefined;
          status: string | null | undefined;
        } & {}
      >
    | undefined;
}

/**
 * "Add to bag" action on the item details page (only rendered for
 * approved + active items). Keeps a small quantity stepper, writes the item
 * into the shared cart and confirms with a toast — the navbar badge then
 * updates immediately.
 */
const AddToBagButton = ({ item, user }: AddToBagButtonProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (user?.role === "vendor" || user?.role === "admin") {
      toast.error(`${user.role.toUpperCase()} isn't able to save items`);
    } else {
      addItem(item, quantity);
      toast.success(`${quantity} × ${item.itemName} added to your bag`);
      setQuantity(1);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      {/* Quantity stepper */}
      <div className="border-border bg-background flex h-10 shrink-0 items-center gap-1 rounded-lg border px-1">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-40"
          disabled={quantity <= 1}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-6 text-center text-sm font-medium tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((current) => Math.min(20, current + 1))}
          className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors disabled:opacity-40"
          disabled={quantity >= 20}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Add action */}
      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "h-10 flex-1 cursor-pointer",
        )}
      >
        <ShoppingBag aria-hidden="true" />
        Add to Bag
      </button>
    </div>
  );
};

export default AddToBagButton;
