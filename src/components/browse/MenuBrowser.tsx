"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RotateCcw, SearchX } from "lucide-react";
import MenuCard from "@/components/browse/MenuCard";
import MenuFilters from "@/components/browse/MenuFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenuItems } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";

interface MenuBrowserProps {
  /** Approved + active items rendered by the server on first load. */
  initialItems: IMenuItem[];
  /** Unique locations from the full menu. */
  locations: string[];
  /**
   * Category slug coming from the URL (e.g. a homepage category card link).
   * Pre-selects the category filter so only that category's items show.
   */
  initialCategory?: string;
}

/**
 * Owns the Browse Menu filter state and asks the server for matching items.
 * The server does the searching/filtering/sorting — this component only
 * sends the selected filters and renders the result.
 */
const MenuBrowser = ({
  initialItems,
  locations,
  initialCategory = "all",
}: MenuBrowserProps) => {
  const [items, setItems] = useState<IMenuItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Wait until the user stops typing before searching.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Ask the server for items whenever a filter changes.
  useEffect(() => {
    // Ignore the response if the filters change while it is still loading.
    let ignore = false;

    const loadItems = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await getMenuItems({
          search: debouncedSearch,
          category,
          location,
          sort,
          // The public menu only shows approved and active items.
          status: "approved",
          active: "true",
        });

        if (!ignore) {
          setItems(Array.isArray(data) ? (data as IMenuItem[]) : []);
        }
      } catch {
        if (!ignore) {
          setItems([]);
          setErrorMessage(
            "We couldn't load the menu right now. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, category, location, sort]);

  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    location !== "all" ||
    sort !== "default";

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("all");
    setLocation("all");
    setSort("default");
  };

  return (
    <>
      {/* Search + filters */}
      <div className="mb-6">
        <MenuFilters
          search={search}
          category={category}
          location={location}
          sort={sort}
          locations={locations}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onLocationChange={setLocation}
          onSortChange={setSort}
          onReset={resetFilters}
          hasFilters={hasFilters}
        />
      </div>

      {/* Error state */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Couldn&apos;t load the menu</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* First loading state */}
      {!errorMessage && loading && items.length === 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!errorMessage && !loading && items.length === 0 && (
        <Empty className="border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>
              {hasFilters ? "No matching items" : "No items found"}
            </EmptyTitle>
            <EmptyDescription>
              {hasFilters
                ? "Nothing matches your search. Try a different name, category or location."
                : "Check back soon — new pizzas are added daily."}
            </EmptyDescription>
          </EmptyHeader>
          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              <RotateCcw aria-hidden="true" />
              Clear filters
            </Button>
          )}
        </Empty>
      )}

      {/* Results */}
      {!errorMessage && items.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              Showing{" "}
              <span className="text-foreground font-medium">{items.length}</span>{" "}
              {items.length === 1 ? "item" : "items"}
            </p>

            {/* Small indicator while the next page of results loads */}
            {loading && hasFilters && (
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Updating results…
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((item, index) => (
              <MenuCard key={item._id ?? index} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MenuBrowser;