"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Pizza, Plus, ShoppingBag, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { cn } from "cn";

/**
 * Navbar shopping bag: icon + unit-count badge opens a side drawer with the
 * saved items, quantity steppers, removal, order links and the running total.
 * The bag lives in localStorage (see `CartProvider`) — checkout happens per
 * item on its details page, which is where orders are actually placed.
 */
const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, count, total, setQuantity, removeItem, clearCart } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger — the badge only appears once the store reports items */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open shopping bag${count > 0 ? ` (${count} items)` : ""}`}
        aria-expanded={open}
        className="text-foreground/70 hover:bg-muted hover:text-foreground relative grid size-8 shrink-0 place-items-center rounded-lg transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {count > 0 && (
          <span
            className="bg-primary text-primary-foreground font-heading absolute -top-1.5 -right-1.5 grid min-w-4 place-items-center rounded-full px-1 text-[10px] leading-4 font-bold"
            aria-hidden="true"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <SheetContent className="gap-0 p-0">
        {/* Header */}
        <div className="border-border border-b px-4 py-4 pr-12 sm:px-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="text-primary size-4" aria-hidden="true" />
            Your bag
            {count > 0 && (
              <span className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="mt-1 text-xs">
            Items are ordered from their own page — each order needs a delivery
            date.
          </SheetDescription>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <div className="border-border bg-muted/40 mt-6 flex flex-col items-center rounded-2xl border border-dashed px-4 py-10 text-center">
              <span className="bg-accent text-primary mb-3 grid size-12 place-items-center rounded-full">
                <Pizza className="size-6" aria-hidden="true" />
              </span>
              <p className="font-heading text-sm font-semibold">Your bag is empty</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Add a pizza from the menu and it will show up here.
              </p>
              <Link
                href="/browse-menu"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-(image:--gradient-primary) text-white hover:opacity-90 mt-4",
                )}
              >
                Browse Menu
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-border bg-card rounded-xl border p-3 shadow-xs"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <Link
                      href={`/browse-menu/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="bg-muted size-14 shrink-0 overflow-hidden rounded-lg"
                    >
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-muted-foreground flex size-full items-center justify-center">
                          <Pizza className="size-5" aria-hidden="true" />
                        </span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/browse-menu/${item.id}`}
                          onClick={() => setOpen(false)}
                          className="font-heading line-clamp-1 text-sm font-semibold hover:text-primary transition-colors"
                        >
                          {item.itemName}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.itemName} from bag`}
                          className="text-muted-foreground hover:text-destructive shrink-0 rounded-md p-1 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {item.location}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        {/* Quantity stepper */}
                        <div className="border-border flex h-7 items-center gap-1 rounded-lg border px-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.itemName}`}
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="text-muted-foreground hover:text-foreground grid size-5 place-items-center rounded-md transition-colors"
                          >
                            <Minus className="size-3" aria-hidden="true" />
                          </button>
                          <span className="min-w-4 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.itemName}`}
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="text-muted-foreground hover:text-foreground grid size-5 place-items-center rounded-md transition-colors"
                          >
                            <Plus className="size-3" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="font-heading text-primary text-sm font-bold tabular-nums">
                          ${(Number(item.price ?? 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order link — orders are placed per item */}
                  <Link
                    href={`/browse-menu/${item.id}`}
                    onClick={() => setOpen(false)}
                    className="text-foreground/80 hover:text-primary border-border mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors"
                  >
                    Order this item
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="border-border border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-heading text-foreground text-base font-bold tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive h-9 flex-1 rounded-lg border border-border text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Clear bag
              </button>
              <Link
                href="/browse-menu"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-9 flex-1 bg-(image:--gradient-primary) text-white hover:opacity-90",
                )}
              >
                Continue shopping
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
