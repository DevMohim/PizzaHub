import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  CookingPot,
  MapPin,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { cn } from "@/lib/utils";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getMyProfile } from "@/lib/api/users";
import { getMyOrders } from "@/lib/api/orders";
import type { IOrder, OrderStatus } from "@/types/order.type";

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className: "bg-warning/10 text-warning ring-warning/30",
    },
    accepted: {
      label: "Approved",
      className: "bg-success/10 text-success ring-success/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive ring-destructive/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-muted text-muted-foreground ring-border",
    },
  };

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default async function CustomerOverviewPage() {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const [profile, orders] = await Promise.all([
    getMyProfile(token),
    getMyOrders(token),
  ]);

  if (profile.role !== "customer") {
    redirect("/");
  }

  const typedOrders: IOrder[] = orders;

  const total = typedOrders.length;
  const pending = typedOrders.filter((o) => o.status === "pending").length;
  const accepted = typedOrders.filter((o) => o.status === "accepted").length;
  const rejected = typedOrders.filter((o) => o.status === "rejected").length;

  // Backend newest first পাঠায়
  const recentOrders = typedOrders.slice(0, 4);
  const firstName = profile.name?.split(" ")[0] ?? "Pizza Lover";
  const initial = profile.name?.charAt(0).toUpperCase() ?? "P";

  const stats = [
    {
      label: "Total Orders",
      value: total,
      icon: ShoppingBag,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      tone: "text-warning bg-warning/10",
    },
    {
      label: "Accepted",
      value: accepted,
      icon: CookingPot,
      tone: "text-success bg-success/10",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      tone: "text-destructive bg-destructive/10",
    },
  ] as const;

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="ring-primary/25 size-12 ring-2">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={profile.name} />
            ) : null}
            <span className="font-heading text-sm font-bold text-white">
              {initial}
            </span>
          </Avatar>
          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
              <UserRound className="size-3.5" aria-hidden="true" />
              Customer
              <span aria-hidden="true">·</span>
              {profile.email}
            </p>
          </div>
        </div>

        <Link
          href="/browse-menu"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-10 shrink-0 bg-(image:--gradient-primary) text-white hover:opacity-90",
          )}
        >
          Browse Menu
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border bg-card rounded-xl border px-4 py-3 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </p>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    stat.tone,
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                {stat.label}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Recent orders */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Recent Orders</CardTitle>
            <CardDescription>Your latest pizza orders</CardDescription>
            <CardAction>
              <Link
                href="/dashboard/customer/orders"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                View all
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ul className="space-y-3">
                {recentOrders.map((order) => (
                  <RecentOrderRow key={order._id} order={order} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <ShoppingBag className="size-6" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="font-heading text-sm font-semibold">
                    No orders yet
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Browse the menu and place your first pizza order.
                  </p>
                </div>
                <Link
                  href="/browse-menu"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-10 bg-(image:--gradient-primary) text-white hover:opacity-90",
                  )}
                >
                  Browse Menu
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side column */}
        <div className="flex flex-col gap-4">
          {/* Profile card */}
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
                  <UserRound aria-hidden="true" />
                  Customer
                </Badge>
              </CardAction>
              <CardTitle className="font-heading">My Profile</CardTitle>
              <CardDescription>
                Your account details and quick actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  {profile.image ? (
                    <AvatarImage src={profile.image} alt={profile.name} />
                  ) : null}
                  <span className="font-heading text-sm font-bold text-white">
                    {initial}
                  </span>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-heading truncate text-sm font-semibold">
                    {profile.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {profile.email}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/customer/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 w-full",
                )}
              >
                <UserRound aria-hidden="true" />
                Profile Settings
              </Link>
            </CardContent>
          </Card>

          {/* Order breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Order Breakdown</CardTitle>
              <CardDescription>
                How your orders are distributed across statuses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  { label: "Pending", value: pending, tone: "bg-warning" },
                  { label: "Accepted", value: accepted, tone: "bg-success" },
                  {
                    label: "Rejected",
                    value: rejected,
                    tone: "bg-destructive",
                  },
                ] as const
              ).map((row) => {
                const pct =
                  total > 0 ? Math.round((row.value / total) * 100) : 0;
                return (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">
                        {row.value}
                        <span className="text-muted-foreground ml-1 text-xs">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <Progress value={pct}>
                      <ProgressTrack>
                        <ProgressIndicator className={row.tone} />
                      </ProgressTrack>
                    </Progress>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const RecentOrderRow = ({ order }: { order: IOrder }) => {
  const status = statusStyles[order.status] ?? statusStyles.pending;

  return (
    <li className="border-border flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Thumbnail */}
      <div className="bg-muted relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
        {order.itemImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={order.itemImage}
            alt={order.itemName}
            className="size-full object-cover"
          />
        ) : null}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h3 className="font-heading truncate text-sm font-semibold">
          {order.itemName}
        </h3>
        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <MapPin className="size-3.5" aria-hidden="true" />
          <span className="truncate">{order.deliveryAddress}</span>
        </p>
        <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatDate(order.deliveryDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            Requested {formatDate(order.createdAt)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="border-border flex shrink-0 items-center justify-between border-t pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
        <StatusCapsule label={status.label} className={status.className} />
      </div>
    </li>
  );
};
