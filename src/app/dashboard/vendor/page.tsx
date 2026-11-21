import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Crown,
  MapPin,
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
  AvatarFallback,
  AvatarBadge,
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
import { cn } from "cn";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMenuItemsByEmail } from "@/lib/api/menuItems";
import { IMenuItem } from "@/types/menuItem.type";
import { getOrdersByVendorEmail } from "@/lib/api/orders";

import { IOrder } from "@/types/order.type";

/* ---------- Static demo data ---------- */

const orderStatusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning ring-warning/30",
  accepted: "bg-success/10 text-success ring-success/30",
};

/* ---------- Page ---------- */

const VendorDashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const menuItems: IMenuItem[] = await getMenuItemsByEmail(
    user?.email as string,
  );
  const orders: IOrder[] = await getOrdersByVendorEmail(user?.email as string);

  const activeitems = menuItems.filter((item) => item.active);

  const pendingsMenuItems = orders.filter((item) => item.status === "pending");
  const acceptedMenuItems = orders.filter((item) => item.status === "accepted");

  const stats = [
    {
      label: "Total Menu Items",
      value: menuItems.length,
      icon: Utensils,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Active Items",
      value: activeitems.length,
      icon: CheckCircle2,
      tone: "text-success bg-success/10",
    },
    {
      label: "Pending Orders",
      value: pendingsMenuItems.length,
      icon: Clock,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "Accepted Orders",
      value: acceptedMenuItems.length,
      icon: TrendingUp,
      tone: "text-secondary bg-secondary/10",
    },
  ] as const;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header — greeting + profile + CTA */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={user?.image || undefined}></AvatarImage>
            <AvatarFallback
              className="font-heading text-sm font-bold text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarBadge className="bg-success" />
          </Avatar>
          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
              <Store className="size-3.5" aria-hidden="true" />
              RC Pizzeria · <MapPin className="size-3.5" aria-hidden="true" />
              Dhanmondi, Dhaka
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
          <Plus />
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

      {/* Charts + plan */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Orders chart */}
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

        {/* Current plan */}
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
                className="text-muted-foreground bg-muted"
              >
                Free Plan
              </Badge>
            </CardAction>
            <CardTitle className="font-heading flex items-center gap-2">
              <Crown className="text-warning size-5" aria-hidden="true" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Free vendors can publish up to 3 active menu items.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <PlanProgress used={3} max={3} />

            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="text-success size-4"
                  aria-hidden="true"
                />
                Up to 3 active menu items
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="text-success size-4"
                  aria-hidden="true"
                />
                Standard menu placement
              </li>
              <li className="flex items-center gap-2 opacity-60">
                <span className="flex size-4 items-center justify-center rounded-full border border-border text-[10px]">
                  ✕
                </span>
                Premium badge &amp; featured placement
              </li>
            </ul>

            <Link href="/dashboard/vendor/subscription">
              <button
                disabled={user?.plan !== "premium"}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 w-full bg-(image:--gradient-primary) text-white hover:opacity-90 disabled:cursor-not-allowed",
                )}
              >
                {" "}
                Upgrade to Premium
                <ArrowUpRight aria-hidden="true" />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders + category chart */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Recent orders */}
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
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="text-muted-foreground pb-2 pr-4 font-medium">
                      Order
                    </th>
                    <th className="text-muted-foreground pb-2 pr-4 font-medium">
                      Customer
                    </th>
                    <th className="text-muted-foreground pb-2 pr-4 font-medium">
                      Date
                    </th>
                    <th className="text-muted-foreground pb-2 pr-4 font-medium">
                      Amount
                    </th>
                    <th className="text-muted-foreground pb-2 text-right font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium">{order.itemName}</p>
                        <p className="text-muted-foreground text-xs">
                          {order._id}
                        </p>
                      </td>
                      <td className="py-3 pr-4">{order.userName}</td>
                      <td className="text-muted-foreground py-3 pr-4">
                        {order.requestedAt?.$date
                          ? new Date(
                              order.requestedAt.$date,
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 font-medium">
                        ${order.price.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
                            orderStatusStyles[order.status as string],
                          )}
                        >
                          <span
                            className="size-1.5 rounded-full bg-current"
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
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="rounded-xl border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {order.itemName}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {order.userName} ·{" "}
                        {order.requestedAt?.$date
                          ? new Date(
                              order.requestedAt.$date,
                            ).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1",
                        orderStatusStyles[order.status as string],
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {order._id} ·{" "}
                    <span className="text-foreground font-medium">
                      ${order.price.toFixed(2)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Category chart */}
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
