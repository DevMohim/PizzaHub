import type { MenuItemStatus } from "@/types/menuItem.type";

/**
 * Visual style per menu item status — the status capsule shown on vendor
 * cards and in the admin review table. Shared so both surfaces match.
 */
export const menuItemStatusStyles: Record<
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
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive ring-destructive/30",
  },
};

/** Resolves an item's status (defaulting to pending) to its capsule style. */
export const getMenuItemStatusStyle = (status?: MenuItemStatus) =>
  menuItemStatusStyles[status ?? "pending"] ?? menuItemStatusStyles.pending;
