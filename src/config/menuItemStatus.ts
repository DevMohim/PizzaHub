import type { IMenuItem, MenuItemStatus } from "@/types/menuItem.type";

type StatusStyle = { label: string; className: string };

const STYLES: Record<MenuItemStatus, StatusStyle> = {
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

const INACTIVE_STYLE: StatusStyle = {
  label: "Inactive",
  className: "bg-muted text-muted-foreground ring-border",
};

/**
 * Status capsule style। Approved item যদি active না থাকে, তবে "Inactive" দেখাবে।
 * Backend এ inactive আলাদা status নয়, approved + active:false।
 */
export const getMenuItemStatusStyle = (
  item: Pick<IMenuItem, "status" | "active"> | MenuItemStatus | undefined,
): StatusStyle => {
  if (typeof item === "object" && item !== null) {
    const status = item.status ?? "pending";
    if (status === "approved" && item.active !== true) return INACTIVE_STYLE;
    return STYLES[status] ?? STYLES.pending;
  }

  return STYLES[item ?? "pending"] ?? STYLES.pending;
};

export const menuItemStatusStyles = STYLES;
