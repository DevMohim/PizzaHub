import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryLabel } from "@/config/menuCategories";
import { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";
import { cn } from "cn";

/** Visual style per item status — the status capsule on the right side. */
const statusStyles: Record<
  MenuItemStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning ring-warning/30",
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success ring-success/30",
  },
  active: {
    label: "Active",
    className: "bg-success/10 text-success ring-success/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive ring-destructive/30",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground ring-border",
  },
};

interface MenuItemCardProps {
  item: IMenuItem;
}

/**
 * Vendor menu item card — item info on the left, status capsule and a
 * delete button on the right. Presentational and reusable across the
 * vendor dashboard.
 */
const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const status: MenuItemStatus = item.status ?? "pending";
  const statusStyle = statusStyles[status] ?? statusStyles.pending;

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5">
      {/* Left — item info */}
      <div className="flex min-w-0 flex-1 gap-4">
        {/* Thumbnail */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center text-xs">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading truncate text-sm font-semibold sm:text-base">
              {item.itemName}
            </h3>
            <Badge variant="outline" className="text-[11px]">
              {getCategoryLabel(item.category)}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {item.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-heading text-primary text-sm font-bold">
              ${Number(item.price ?? 0).toFixed(2)}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <MapPin className="size-3.5" aria-hidden="true" />
              {item.location}
            </span>
          </div>
        </div>
      </div>

      {/* Right — status capsule + delete, side by side */}
      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-border pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Edit ${item.itemName}`}
          title="Edit item"
          className="shrink-0 cursor-pointer"
        >
          <Pencil />
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label={`Delete ${item.itemName}`}
          title="Delete item"
          className="shrink-0 cursor-pointer"
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  );
};

export default MenuItemCard;
