import { AlertCircle, Pizza, SearchX } from "lucide-react";
import { getMenuItems } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";
import MenuCard from "@/components/browse/MenuCard";
import MenuFilters from "@/components/browse/MenuFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const BrowseMenuItemsPage = async () => {
  /* Fetch the public menu — only approved & active items are shown. */
  let menuItems: IMenuItem[] = [];
  let errorMessage: string | null = null;

  try {
    const data = await getMenuItems();
    menuItems = Array.isArray(data) ? (data as IMenuItem[]) : [];
  } catch {
    errorMessage =
      "We couldn't load the menu right now. Please refresh and try again.";
  }

  const visibleItems = menuItems.filter((item) => item.status === "approved" && item.active === true);
  /* Unique locations for the location filter. */
  const locations = Array.from(
    new Set(
      visibleItems
        .map((item) => item.location?.trim())
        .filter((location): location is string => Boolean(location)),
    ),
  ).sort();

  return (
    <div className="w-full">
      {/* Page header */}
      <section className="bg-(image:--gradient-warm) border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <span className="bg-accent text-primary inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            <Pizza className="size-3.5" aria-hidden="true" />
            Fresh from the oven
          </span>
          <h1 className="font-heading mt-4 text-3xl font-bold sm:text-4xl">
            Browse Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
            Explore approved pizzas and sides from local pizzerias — search by
            name, filter by category or location, and find your next favorite.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* Error state */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertTitle>Couldn&apos;t load the menu</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Filters — search by name, filter by category & location */}
        {!errorMessage && (
          <div className="mb-6">
            <MenuFilters locations={locations} />
          </div>
        )}

        {/* Results count */}
        {!errorMessage && visibleItems.length > 0 && (
          <p className="text-muted-foreground mb-4 text-sm">
            Showing{" "}
            <span className="text-foreground font-medium">
              {visibleItems.length}
            </span>{" "}
            {visibleItems.length === 1 ? "item" : "items"}
          </p>
        )}

        {/* Empty state */}
        {!errorMessage && visibleItems.length === 0 && (
          <Empty className="border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No items found</EmptyTitle>
              <EmptyDescription>
                Nothing matches the current filters yet — try a different search
                or check back soon, new pizzas are added daily.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {/* Responsive card grid */}
        {!errorMessage && visibleItems.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visibleItems.map((item, index) => (
              <MenuCard key={item._id ?? index} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseMenuItemsPage;
