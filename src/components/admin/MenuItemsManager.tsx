"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MapPin, Pizza, SearchX, Store } from "lucide-react";
import MenuItemRowActions from "@/components/admin/MenuItemRowActions";
import MenuItemsFilters, {
  type VendorOption,
} from "@/components/admin/MenuItemsFilters";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { Badge } from "@/components/ui/badge";
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
import type { IMenuItem } from "@/types/menuItem.type";
import { cn } from "@/lib/utils";

const thumbTints = [
  "bg-primary/10 text-primary",
  "bg-warning/10 text-warning",
  "bg-secondary/10 text-secondary",
  "bg-success/10 text-success",
];

interface MenuItemsManagerProps {
  items: IMenuItem[];
  total: number;
  page: number;
  limit: number;
  vendors: VendorOption[];
  initialFilters: {
    search: string;
    status: string;
    category: string;
    vendor: string;
    sort: string;
  };
}

const MenuItemsManager = ({
  items,
  total,
  page,
  limit,
  vendors,
  initialFilters,
}: MenuItemsManagerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasFilters =
    initialFilters.search !== "" ||
    initialFilters.status !== "all" ||
    initialFilters.category !== "all" ||
    initialFilters.vendor !== "all" ||
    initialFilters.sort !== "newest";

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <>
      <div className="mb-5">
        <MenuItemsFilters
          initial={initialFilters}
          vendors={vendors}
          resultCount={items.length}
          totalCount={total}
        />
      </div>

      {items.length > 0 ? (
        <Card className="gap-0 py-0">
          <CardHeader className="border-border border-b py-4">
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Page {page} of {totalPages} · {total} items
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{items.length} shown</Badge>
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
                  <TableHead className="w-30 hidden text-xs tracking-wide uppercase lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="w-75 pr-4 text-right text-xs tracking-wide uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item, index) => {
                  const statusStyle = getMenuItemStatusStyle(item.status);
                  const image = item.images?.[0];

                  return (
                    <TableRow key={item._id}>
                      <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={cn(
                              "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg",
                              thumbTints[index % thumbTints.length],
                            )}
                          >
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={image}
                                alt={item.itemName}
                                loading="lazy"
                                className="size-full object-cover"
                              />
                            ) : (
                              <Pizza className="size-5" aria-hidden="true" />
                            )}
                          </div>

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
                                  {item.vendorName ||
                                    item.vendorEmail ||
                                    "Unknown vendor"}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 align-middle">
                        <StatusCapsule
                          label={statusStyle.label}
                          className={statusStyle.className}
                        />
                      </TableCell>

                      <TableCell className="text-muted-foreground hidden py-3 align-middle text-xs lg:table-cell">
                        {item.location}
                      </TableCell>

                      <TableCell className="py-3 pr-4 align-middle">
                        <MenuItemRowActions item={item} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-border flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="border-input hover:bg-accent rounded-lg border px-3 py-1.5 disabled:opacity-50"
                >
                  Previous page
                </button>
                <span className="text-muted-foreground text-xs">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="border-input hover:bg-accent rounded-lg border px-3 py-1.5 disabled:opacity-50"
                >
                  Next page
                </button>
              </div>
            )}
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
              ? "No Item found, Change filter and try later"
              : "There is no menu to show।"}
          </p>
        </div>
      )}
    </>
  );
};

export default MenuItemsManager;
