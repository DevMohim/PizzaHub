import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
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
import type { IMenuItem } from "@/types/menuItem.type";
import { cn } from "@/lib/utils";

const MenuItemsPage = async () => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "vendor") {
    redirect("/");
  }

  let items: IMenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    items = await getMenuItemsByEmail(token);
  } catch (error) {
    console.error("[vendor/menu-items] load failed:", error);
    errorMessage =
      "We couldn't load your menu items. Please check your connection and try again.";
  }

  const total = items.length;
  const pending = items.filter((item) => item.status === "pending").length;
  const live = items.filter(
    (item) => item.status === "approved" && item.active === true,
  ).length;

  return (
    <div className="w-full px-4 py-8 md:px-6">
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
          <Plus aria-hidden="true" />
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
              className="border-border bg-card rounded-xl border px-4 py-3 shadow-xs"
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

      {/* Error */}
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Empty */}
      {!errorMessage && items.length === 0 && (
        <Empty className="border-border bg-card border">
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
              <Plus aria-hidden="true" />
              Add Menu Item
            </Link>
          </EmptyContent>
        </Empty>
      )}

      {/* List */}
      {!errorMessage && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemsPage;
