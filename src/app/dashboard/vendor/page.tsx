import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Crown,
  Plus,
  Store,
  TrendingUp,
  Utensils,
} from "lucide-react";
import {
  CategoryBarChart,
  OrdersAreaChart,
} from "@/components/dashboard/VendorCharts";
import PlanProgress from "@/components/dashboard/PlanProgress";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
import { getMenuItemsByEmail } from "@/lib/api/menuItems";
import { getOrdersByVendorEmail } from "@/lib/api/orders";
import type { OrderStatus } from "@/types/order.type";

const FREE_ACTIVE_LIMIT = 3;

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning ring-warning/30",
  accepted: "bg-success/10 text-success ring-success/30",
  rejected: "bg-destructive/10 text-destructive ring-destructive/30",
  cancelled: "bg-muted text-muted-foreground ring-border",
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "—";

const VendorDashboardPage = async () => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  // Server Component তে token explicit ভাবে পাঠাতে হয়
  const [profile, menuItems, orders] = await Promise.all([
    getMyProfile(token),
    getMenuItemsByEmail(token),
    getOrdersByVendorEmail(token),
  ]);


  const isPremium = profile.subscriptionPlan === "premium";
  const activeItems = menuItems.filter((item) => item.active);
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const acceptedOrders = orders.filter((order) => order.status === "accepted");
  // Backend newest first পাঠায়
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Menu Items",
      value: menuItems.length,
      icon: Utensils,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Active Items",
      value: activeItems.length,
      icon: CheckCircle2,
      tone: "text-success bg-success/10",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: Clock,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "Accepted Orders",
      value: acceptedOrders.length,
      icon: TrendingUp,
      tone: "text-secondary bg-secondary/10",
    },
  ] as const;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={profile.image || undefined} />
            <AvatarFallback
              className="font-heading text-sm font-bold text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarBadge className="bg-success" />
          </Avatar>
          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              Welcome back, {profile.businessName} 👋
            </h1>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
              <Store className="size-3.5" aria-hidden="true" />
              {profile.businessName || "Your restaurant"}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/vendor/menu-items/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 shrink-0 bg-(image:--gradient-primary) text-white hover:opacity-90",
          )}
        >
          <Plus aria-hidden="true" />
          Add Menu Item
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="py-4">
              <CardContent className="flex items-start justify-between gap-3 px-4">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="font-heading mt-1 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    stat.tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart + plan */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Orders This Week</CardTitle>
            <CardDescription>
              Daily order volume across the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersAreaChart />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden="true"
          />
          <CardHeader>
            <CardAction>
              <Badge
                variant="outline"
                className={cn(
                  isPremium
                    ? "text-warning bg-warning/10"
                    : "text-muted-foreground bg-muted",
                )}
              >
                {isPremium ? "Premium" : "Free Plan"}
              </Badge>
            </CardAction>
            <CardTitle className="font-heading flex items-center gap-2">
              <Crown className="text-warning size-5" aria-hidden="true" />
              Current Plan
            </CardTitle>
            <CardDescription>
              {isPremium
                ? "Unlimited active menu items and Premium benefits."
                : `Free vendors can publish up to ${FREE_ACTIVE_LIMIT} active menu items.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <PlanProgress
              used={activeItems.length}
              max={
                isPremium ? Math.max(activeItems.length, 1) : FREE_ACTIVE_LIMIT
              }
            />

            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="text-success size-4"
                  aria-hidden="true"
                />
                {isPremium
                  ? "Unlimited active menu items"
                  : `Up to ${FREE_ACTIVE_LIMIT} active menu items`}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="text-success size-4"
                  aria-hidden="true"
                />
                {isPremium
                  ? "Featured placement on homepage"
                  : "Standard menu placement"}
              </li>
              <li
                className={cn(
                  "flex items-center gap-2",
                  !isPremium && "opacity-60",
                )}
              >
                {isPremium ? (
                  <CheckCircle2
                    className="text-success size-4"
                    aria-hidden="true"
                  />
                ) : (
                  <span className="border-border flex size-4 items-center justify-center rounded-full border text-[10px]">
                    ✕
                  </span>
                )}
                Premium badge &amp; featured placement
              </li>
            </ul>

            <Link
              href="/dashboard/vendor/subscription"
              aria-disabled={isPremium}
              tabIndex={isPremium ? -1 : undefined}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 w-full bg-(image:--gradient-primary) text-white hover:opacity-90",
                isPremium && "pointer-events-none opacity-60",
              )}
            >
              {isPremium ? "Already Premium" : "Upgrade to Premium"}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + category chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders for your items
            </CardDescription>
            <CardAction>
              <Link
                href="/dashboard/vendor/orders"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                View all
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                এখনো কোনো order আসেনি।
              </p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-border border-b text-left">
                        <th className="text-muted-foreground pr-4 pb-2 font-medium">
                          Item
                        </th>
                        <th className="text-muted-foreground pr-4 pb-2 font-medium">
                          Customer
                        </th>
                        <th className="text-muted-foreground pr-4 pb-2 font-medium">
                          Delivery
                        </th>
                        <th className="text-muted-foreground pb-2 text-right font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-border/60 border-b last:border-0"
                        >
                          <td className="py-3 pr-4">
                            <p className="font-medium">{order.itemName}</p>
                            <p className="text-muted-foreground text-xs">
                              {order._id}
                            </p>
                          </td>
                          <td className="py-3 pr-4">{order.customerName}</td>
                          <td className="text-muted-foreground py-3 pr-4">
                            {formatDate(order.deliveryDate)}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
                                orderStatusStyles[order.status],
                              )}
                            >
                              <span
                                className="bg-current size-1.5 rounded-full"
                                aria-hidden="true"
                              />
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list */}
                <ul className="space-y-3 md:hidden">
                  {recentOrders.map((order) => (
                    <li
                      key={order._id}
                      className="border-border rounded-xl border p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {order.itemName}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {order.customerName} ·{" "}
                            {formatDate(order.deliveryDate)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
                            orderStatusStyles[order.status],
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-2 truncate text-xs">
                        {order.deliveryAddress}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Items by Category</CardTitle>
            <CardDescription>
              How your menu is distributed across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
