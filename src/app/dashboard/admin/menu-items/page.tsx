import { Check, Eye, EyeOff, Info, MapPin, Pizza, Store, Trash2, X } from "lucide-react";
import MenuItemsFilters from "@/components/admin/MenuItemsFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";
import { cn } from "cn";
import { getMenuItems } from "@/lib/api/menuItems";

/** Warm tint cycle for image-less thumbnails. */
const thumbTints = [
  "bg-primary/10 text-primary",
  "bg-warning/10 text-warning",
  "bg-secondary/10 text-secondary",
  "bg-success/10 text-success",
];

const RowActions = ({ item }: { item: IMenuItem }) => {
  const status: MenuItemStatus = item.status ?? "pending";
  const name = item.itemName;

  const approve =
    status === "pending" || status === "rejected" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Approve ${name}`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
      >
        <Check aria-hidden="true" />
        Approve
      </Button>
    ) : null;

  const reject =
    status === "pending" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Reject ${name}`}
        className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
      >
        <X aria-hidden="true" />
        Reject
      </Button>
    ) : null;

  const toggleStatus =
    status === "approved" || status === "active" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Make ${name} inactive`}
        className="text-muted-foreground hover:text-foreground"
      >
        <EyeOff aria-hidden="true" />
        Make Inactive
      </Button>
    ) : status === "inactive" ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label={`Make ${name} active`}
        className="border-success/40 text-success hover:bg-success/10 hover:text-success"
      >
        <Eye aria-hidden="true" />
        Make Active
      </Button>
    ) : null;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {approve}
      {reject}
      {toggleStatus}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        aria-label={`Delete ${name}`}
      >
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
};

/* ---------- Page ---------- */

const ManageMenuItemsPage = async() => {
   const menuItems : IMenuItem[] = await getMenuItems()
  const pendingCount = menuItems.filter(
    (item) => (item.status ?? "pending") === "pending",
  ).length;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Manage Menu Items
        </h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          View, search, and filter every submission. Review pending items, then
          approve or reject them — and change the status of published items or
          delete inappropriate ones.
        </p>
      </div>

      {/* Visibility rule */}
      <Alert className="mb-5 border-primary/30 bg-primary/5">
        <Info aria-hidden="true" />
        <AlertTitle className="font-heading font-semibold">
          Public visibility
        </AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Only <span className="text-foreground font-medium">approved</span> and{" "}
          <span className="text-foreground font-medium">active</span> items
          appear on the public Browse Menu. Pending, rejected, and inactive
          items stay hidden from customers.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <div className="mb-5">
        <MenuItemsFilters />
      </div>

      {/* Table */}
      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>
            {menuItems.length} items · {pendingCount} awaiting review
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">{menuItems.length} total</Badge>
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
                  Submitted
                </TableHead>
                <TableHead className="w-75 pr-4 text-right text-xs tracking-wide uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {menuItems.map((item, index) => {
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
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
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
                              <MapPin className="size-3.5" aria-hidden="true" />
                              {item.location}
                            </span>
                            <span className="text-muted-foreground hidden items-center gap-1 md:flex">
                              <Store className="size-3.5" aria-hidden="true" />
                              <span className="max-w-40 truncate">
                                {item.userEmail || "Local Pizzeria"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status capsule */}
                    <TableCell className="py-3 align-middle">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
                          statusStyle.className,
                        )}
                      >
                        <span
                          className="size-1.5 rounded-full bg-current"
                          aria-hidden="true"
                        />
                        {statusStyle.label}
                      </span>
                    </TableCell>

                    {/* Submitted date */}
                    <TableCell className="text-muted-foreground hidden py-3 align-middle text-xs lg:table-cell">
                      {item.location}
                    </TableCell>

                    {/* Right — actions */}
                    <TableCell className="py-3 pr-4 align-middle">
                      <RowActions item={item} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageMenuItemsPage;
