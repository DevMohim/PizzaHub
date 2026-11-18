import Link from "next/link";
import { ArrowRight, MapPin, Pizza, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryLabel } from "@/config/menuCategories";
import { IMenuItem } from "@/types/menuItem.type";
import { cn } from "cn";

interface MenuCardProps {
  item: IMenuItem;
}

/**
 * Public menu item card for the Browse Menu page — image, name, category,
 * price, location, vendor info and a View Details button. Presentational
 * and reusable across public menu surfaces.
 */
const MenuCard = ({ item }: MenuCardProps) => {
  const detailsHref = item._id ? `/menu/${item._id}` : "/browse-menu";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.itemName}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">
            <Pizza className="size-8" aria-hidden="true" />
          </div>
        )}

        {/* Category overlay */}
        <Badge
          variant="outline"
          className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm"
        >
          {getCategoryLabel(item.category)}
        </Badge>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading line-clamp-1 text-base font-semibold">
            {item.itemName}
          </h3>
          <span className="font-heading text-primary shrink-0 text-base font-bold">
            ${Number(item.price ?? 0).toFixed(2)}
          </span>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {item.location}
          </span>
        </div>

        {/* Vendor info */}
        <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
          <span className="bg-accent text-primary flex size-7 shrink-0 items-center justify-center rounded-full">
            <Store className="size-3.5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="text-muted-foreground block text-[11px] leading-none">
              Sold by
            </span>
            <span className="block truncate text-xs font-medium">
              {item.userEmail || "Local Pizzeria"}
            </span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Link
          href={detailsHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 w-full bg-(image:--gradient-primary) text-white hover:opacity-90",
          )}
        >
          View Details
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default MenuCard;
