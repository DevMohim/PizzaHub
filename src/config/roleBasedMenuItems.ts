import {
  LayoutDashboard,
  Utensils,
  Plus,
  ShoppingBag,
  CreditCard,
  UserRound,
  Users,
  Receipt,
} from "lucide-react";

export const roleBasedMenuItems = {
  vendor: [
    { label: "Overview", href: "/dashboard/vendor/", icon: LayoutDashboard },
    {
      label: "My Menu Items",
      href: "/dashboard/vendor/menu-items",
      icon: Utensils,
    },
    {
      label: "Add Menu Item",
      href: "/dashboard/vendor/menu-items/new",
      icon: Plus,
    },
    {
      label: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: ShoppingBag,
    },
    {
      label: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: CreditCard,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/vendor/settings",
      icon: UserRound,
    },
  ],

  customer: [
    { label: "Overview", href: "/dashboard/customer/", icon: LayoutDashboard },
    {
      label: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/customer/settings",
      icon: UserRound,
    },
  ],

  admin: [
    { label: "Overview", href: "/dashboard/admin/", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Menu Items",
      href: "/dashboard/admin/menu-items",
      icon: Utensils,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
};
