import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react";
import { getMenuItemsById } from "@/lib/api/menuItems";
import ItemGallery from "@/components/browse/ItemGallery";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCategoryLabel } from "@/config/menuCategories";
import AddToBagButton from "@/components/browse/AddToBagButton";
import { cn } from "cn";

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ItemDetailsPage = async ({ params }: ItemDetailsPageProps) => {
  const { id } = await params;

 let item: Awaited<ReturnType<typeof getMenuItemsById>> | null = null;
 let errorMessage: string | null = null;

 try {
   item = await getMenuItemsById(id);
 } catch {
   errorMessage =
     "We couldn't load this item right now. Please refresh and try again.";
 }

  /* Error state */
  if (errorMessage) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Couldn&apos;t load the item</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <Link
          href="/browse-menu"
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          <ArrowLeft />
          Back to Browse Menu
        </Link>
      </div>
    );
  }

  /* Not found — invalid ID or missing record */
  if (!item) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBag />
            </EmptyMedia>
            <EmptyTitle>Item not found</EmptyTitle>
            <EmptyDescription>
              This menu item doesn&apos;t exist or may have been removed by the
              vendor.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/browse-menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 bg-(image:--gradient-primary) text-white hover:opacity-90",
              )}
            >
              <ArrowLeft />
              Back to Browse Menu
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  /* Only approved & active items can be ordered. */
  const isOrderable =
    item.status === "approved" && item.active === true;

  const galleryImages =
    item.images && item.images.length > 0
      ? item.images
      : item.imageUrl
        ? [item.imageUrl]
        : [];

  return (
    <div className="w-full">
      {/* Breadcrumb bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 text-sm sm:px-6">
          <Link
            href="/browse-menu"
            className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Browse Menu
          </Link>
          <span className="text-muted-foreground" aria-hidden="true">
            /
          </span>
          <span className="text-foreground truncate font-medium">
            {item.itemName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Left — gallery + description + vendor */}
        <div className="space-y-8">
          <ItemGallery images={galleryImages} alt={item.itemName} />

          {/* Description */}
          <section>
            <h2 className="font-heading text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </section>

          {/* Vendor info */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <h2 className="font-heading text-lg font-semibold">Vendor</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <Store className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.userEmail || "Local Pizzeria"}
                </p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {item.location}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right — item summary + order option */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Summary */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {getCategoryLabel(item.category)}
              </Badge>
              {isOrderable ? (
                <Badge className="bg-success/10 text-success ring-success/30 ring-1">
                  Available
                </Badge>
              ) : (
                <Badge variant="secondary">Currently Unavailable</Badge>
              )}
            </div>

            <h1 className="font-heading mt-3 text-2xl font-bold sm:text-3xl">
              {item.itemName}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-heading text-primary text-3xl font-bold">
                ${Number(item.price ?? 0).toFixed(2)}
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin className="size-4" aria-hidden="true" />
                {item.location}
              </span>
            </div>
          </div>

          {/* Order option */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <h2 className="font-heading flex items-center gap-2 text-lg font-semibold">
              <ShoppingBag className="text-primary size-5" aria-hidden="true" />
              Place an Order
            </h2>

            {isOrderable ? (
              <div className="mt-4 space-y-4">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex h-10 w-36 items-center justify-between rounded-lg border border-input px-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="text-sm font-medium tabular-nums">1</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
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
                    className="h-10"
                  />
                </div>

                {/* Delivery address */}
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Delivery Address</Label>
                  <Textarea
                    id="delivery-address"
                    name="deliveryAddress"
                    placeholder="House, road, area, city…"
                    className="min-h-20"
                  />
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
                  />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 w-full bg-(image:--gradient-primary) text-white hover:opacity-90",
                  )}
                >
                  Order Now
                </button>

                {/* Save for later — goes to the navbar bag */}
                <div>
                  <p className="text-muted-foreground mb-1.5 text-xs">
                    Not ready to order yet? Keep it in your bag.
                  </p>
                  <AddToBagButton
                    item={{
                      id: item._id ?? id,
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
            ) : (
              /* Not orderable — pending, rejected or inactive items */
              <div className="bg-muted/60 mt-4 rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-sm font-medium">
                  This item isn&apos;t available for ordering
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  It is awaiting admin review or has been unpublished. Check
                  back soon.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
