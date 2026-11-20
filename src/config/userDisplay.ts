import type { UserRole } from "@/types/user.type";

/**
 * Visual style per account status — the capsule shown in the admin
 * Manage Users table. Shared so other user surfaces can match it.
 */
export const userStatusStyles = {
  active: {
    label: "Active",
    className: "bg-success/10 text-success ring-success/30",
  },
  blocked: {
    label: "Blocked",
    className: "bg-destructive/10 text-destructive ring-destructive/30",
  },
} as const;

/** Resolves a user's block state to its capsule style. */
export const getUserStatusStyle = (isBlocked?: boolean) =>
  isBlocked ? userStatusStyles.blocked : userStatusStyles.active;

/** Badge style per role — Admin, Vendor, Customer. */
export const userRoleStyles: Record<
  UserRole | "admin",
  { label: string; className: string }
> = {
  admin: {
    label: "Admin",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  vendor: {
    label: "Vendor",
    className: "border-warning/40 bg-warning/10 text-warning",
  },
  customer: {
    label: "Customer",
    className: "border-border bg-muted text-muted-foreground",
  },
};
