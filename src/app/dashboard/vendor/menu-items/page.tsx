import Link from "next/link";
import { headers } from "next/headers";
import { AlertCircle, Lock, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getMenuItemsByEmail } from "@/lib/api/menuItems";
import MenuItemCard from "@/components/dashboard/MenuItemCard";
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
import { IMenuItem } from "@/types/menuItem.type";
import { cn } from "cn";

const MenuItemsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  /* Not signed in — prompt instead of fetching. */
  if (!email) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>Please sign in</EmptyTitle>
            <EmptyDescription>
              You need to be signed in as a vendor to manage your menu items.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 bg-(image:--gradient-primary) text-white hover:opacity-90",
              )}
            >
              Sign In
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  /* Fetch this vendor's menu items — surface failures clearly. */
  let items: IMenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getMenuItemsByEmail(email);
    items = Array.isArray(data) ? (data as IMenuItem[]) : [];
  } catch {
    errorMessage =
      "We couldn't load your menu items. Please check your connection and try again.";
  }

  const total = items.length;
  const pending = items.filter((item) => (item.status ?? "pending") === "pending").length;
  const live = items.filter(
    (item) => item.status === "approved" || item.status === "active",
  ).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            My Menu Items
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your pizza listings. New items are reviewed by an admin
            before they appear on the menu.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/menu-items/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 shrink-0 bg-(image:--gradient-primary) text-white hover:opacity-90",
          )}
        >
          <Plus />
          Add Menu Item
        </Link>
      </div>

      {/* Stats */}
      {total > 0 && !errorMessage && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total Items", value: total },
            { label: "Pending Review", value: pending },
            { label: "Live on Menu", value: live },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card px-4 py-3 shadow-xs"
            >
              <p className="font-heading text-xl font-bold sm:text-2xl">
                {stat.value}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!errorMessage && items.length === 0 && (
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Plus />
            </EmptyMedia>
            <EmptyTitle>No menu items yet</EmptyTitle>
            <EmptyDescription>
              Create your first pizza listing to start reaching customers.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/dashboard/vendor/menu-items/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 bg-(image:--gradient-primary) text-white hover:opacity-90",
              )}
            >
              <Plus />
              Add Menu Item
            </Link>
          </EmptyContent>
        </Empty>
      )}

      {/* Item list */}
      {!errorMessage && items.length > 0 && (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <MenuItemCard
              key={item._id ?? index}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemsPage;
