
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  ShoppingBag,
  Store,
} from "lucide-react";
import { getMenuItemsById } from "@/lib/api/menuItems";
import ItemGallery from "@/components/browse/ItemGallery";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCategoryLabel } from "@/config/menuCategories";
import { cn } from "cn";
import OrderForm from "@/components/customer/OrderForm";

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
              <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
              <Badge className="bg-success/10 text-success ring-success/30 ring-1">
                Available
              </Badge>
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
          <OrderForm item={item} />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
