"use client";

import { useMemo, useState } from "react";
import { MapPin, Pizza, RotateCcw, SearchX, Store } from "lucide-react";
import MenuItemRowActions from "@/components/admin/MenuItemRowActions";
import MenuItemsFilters from "@/components/admin/MenuItemsFilters";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryLabel } from "@/config/menuCategories";
import { getMenuItemStatusStyle } from "@/config/menuItemStatus";
import { IMenuItem } from "@/types/menuItem.type";
import { cn } from "cn";

/** Warm tint cycle for image-less thumbnails. */
const thumbTints = [
  "bg-primary/10 text-primary",
  "bg-warning/10 text-warning",
  "bg-secondary/10 text-secondary",
  "bg-success/10 text-success",
];

/**
 * Checks one item against the selected status filter.
 * "Active"/"Inactive" only apply to approved items — pending and rejected
 * items are neither published nor unpublished yet.
 */
const matchesStatusFilter = (item: IMenuItem, filter: string) => {
  const itemStatus = item.status ?? "pending";

  if (filter === "all") return true;
  if (filter === "active") {
    return itemStatus === "approved" && item.active !== false;
  }
  if (filter === "inactive") {
    return itemStatus === "approved" && item.active === false;
  }

  return itemStatus === filter;
};

interface MenuItemsManagerProps {
  menuItems: IMenuItem[];
}

const MenuItemsManager = ({ menuItems }: MenuItemsManagerProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const pendingCount = useMemo(
    () =>
      menuItems.filter((item) => (item.status ?? "pending") === "pending")
        .length,
    [menuItems],
  );

  // Filter in the browser so results update instantly as the admin types.
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.itemName.toLowerCase().includes(query) ||
        (item.vendorEmail ?? "").toLowerCase().includes(query);

      const matchesCategory = category === "all" || item.category === category;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatusFilter(item, status)
      );
    });
  }, [menuItems, search, status, category]);

  const hasFilters =
    search.trim() !== "" || status !== "all" || category !== "all";

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-5">
        <MenuItemsFilters
          search={search}
          status={status}
          category={category}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          onReset={resetFilters}
          hasFilters={hasFilters}
          resultCount={filteredItems.length}
          totalCount={menuItems.length}
        />
      </div>

      {/* Table */}
      {filteredItems.length > 0 ? (
        <Card className="gap-0 py-0">
          <CardHeader className="border-b border-border py-4">
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              {filteredItems.length} of {menuItems.length} items ·{" "}
              {pendingCount} awaiting review
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">
                {filteredItems.length} shown
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            <Table className="min-w-190">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-xs tracking-wide uppercase">
                    Menu Item
                  </TableHead>
                  <TableHead className="w-30 text-xs tracking-wide uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden w-30 text-xs tracking-wide uppercase lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="w-75 pr-4 text-right text-xs tracking-wide uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredItems.map((item, index) => {
                  const statusStyle = getMenuItemStatusStyle(item.status);

                  return (
                    <TableRow key={item._id}>
                      {/* Left — item info */}
                      <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                        <div className="flex min-w-0 items-center gap-3">
                          {/* Thumbnail */}
                          <div
                            className={cn(
                              "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg",
                              thumbTints[index % thumbTints.length],
                            )}
                          >
                            {item.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.images[0]}
                                alt={item.itemName}
                                loading="lazy"
                                className="size-full object-cover"
                              />
                            ) : (
                              <Pizza className="size-5" aria-hidden="true" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-heading truncate text-sm font-semibold">
                                {item.itemName}
                              </span>
                              <Badge
                                variant="outline"
                                className="hidden shrink-0 text-[11px] sm:inline-flex"
                              >
                                {getCategoryLabel(item.category)}
                              </Badge>
                            </div>

                            <p className="text-muted-foreground mt-0.5 line-clamp-1 max-w-75 text-xs xl:max-w-105">
                              {item.description}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                              <span className="text-primary font-heading font-bold">
                                ${Number(item.price ?? 0).toFixed(2)}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <MapPin
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                {item.location}
                              </span>
                              <span className="text-muted-foreground hidden items-center gap-1 md:flex">
                                <Store
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                <span className="max-w-40 truncate">
                                  {item.vendorEmail || "Local Pizzeria"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status capsule */}
                      <TableCell className="py-3 align-middle">
                        <StatusCapsule
                          label={statusStyle.label}
                          className={statusStyle.className}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell className="text-muted-foreground hidden py-3 align-middle text-xs lg:table-cell">
                        {item.location}
                      </TableCell>

                      {/* Right — actions */}
                      <TableCell className="py-3 pr-4 align-middle">
                        <MenuItemRowActions item={item} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="border-border bg-muted/40 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
          <div className="bg-accent text-accent-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {hasFilters ? (
              <SearchX className="size-7" aria-hidden="true" />
            ) : (
              <span className="text-3xl" aria-hidden="true">
                🍽️
              </span>
            )}
          </div>

          <h2 className="text-foreground font-heading text-xl font-semibold">
            {hasFilters ? "No matching menu items" : "No menu items found"}
          </h2>

          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            {hasFilters
              ? "No items match your search. Try a different name, status, or category."
              : "There are no menu items to show right now. Check back later."}
          </p>

          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="mt-4"
            >
              <RotateCcw aria-hidden="true" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default MenuItemsManager;
