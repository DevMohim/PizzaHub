import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/config/menuCategories";
import { getMenuItemStatusStyle } from "@/config/menuItemStatus";
import { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";
import StatusCapsule from "@/components/shared/StatusCapsule";
import MenuEditDialog from "../vendor/MenuEditDialog";
import MenuDeleteDialog from "../vendor/MenuDeleteDialog";

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
  const statusStyle = getMenuItemStatusStyle(status);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:gap-5">
      {/* Left — item info */}
      <div className="flex min-w-0 flex-1 gap-4">
        {/* Thumbnail */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
          {item.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.images[0]}
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
        <StatusCapsule
          label={statusStyle.label}
          className={statusStyle.className}
        />
        <MenuEditDialog item={item}/>

        <MenuDeleteDialog item={item} />
      </div>
    </article>
  );
};

export default MenuItemCard;
