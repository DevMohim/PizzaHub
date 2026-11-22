import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  MapPin,
  ShoppingBag,
  Store,
} from "lucide-react";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMenuItemsById } from "@/lib/api/menuItems";
import type { IMenuItem } from "@/types/menuItem.type";
import ItemGallery from "@/components/browse/ItemGallery";
import OrderForm from "@/components/customer/OrderForm";
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
import { cn } from "@/lib/utils";

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ItemDetailsPage = async ({ params }: ItemDetailsPageProps) => {
  const { id } = await params;

  const token = await getTokenFromServer();

  // Item details শুধু logged-in user দেখতে পারে
  if (!token) {
    redirect(`/sign-in?redirect=/browse-menu/${id}`);
  }

  let item: IMenuItem | null = null;
  let errorMessage: string | null = null;

  try {
    item = await getMenuItemsById(id, token);
  } catch (error) {
    // 404 হলে item নেই, অন্য error হলে সাধারণ বার্তা
    const status = (error as { status?: number }).status;
    if (status !== 404) {
      errorMessage =
        "We couldn't load this item right now. Please refresh and try again.";
    }
  }

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

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <Empty className="border-border bg-card border">
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

  const galleryImages: string[] = (
    Array.isArray(item.images) ? item.images : []
  ).filter(
    (image): image is string => typeof image === "string" && image.length > 0,
  );

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="border-border bg-card border-b">
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
        {/* Left */}
        <div className="space-y-8">
          <ItemGallery images={galleryImages} alt={item.itemName} />

          <section>
            <h2 className="font-heading text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </section>

          <section className="border-border bg-card rounded-2xl border p-4 shadow-xs">
            <h2 className="font-heading text-lg font-semibold">Vendor</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                <Store className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {item.vendorName || item.vendorEmail || "Local Pizzeria"}
                </p>
                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {item.location}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
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

          <OrderForm item={item} />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
