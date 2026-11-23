import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CookingPot,
  MapPin,
  Package,
  ShoppingBag,
  Utensils,
  XCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusCapsule from "@/components/shared/StatusCapsule";
import CancelOrderBtn from "@/components/customer/CancelOrderBtn";
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
      label: "Accepted",
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

const OrderCard = ({ order }: { order: IOrder }) => {
  const status = statusStyles[order.status] ?? statusStyles.pending;

  return (
    <article className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-stretch sm:gap-5">
      {/* Thumbnail */}
      <div className="bg-muted relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-28">
        {order.itemImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={order.itemImage}
            alt={order.itemName}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Title + status */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-heading truncate text-base font-semibold">
              {order.itemName}
            </h3>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <Utensils className="size-3.5" aria-hidden="true" />
              <span className="truncate">
                {order.vendorName || order.vendorEmail}
              </span>
            </p>
          </div>

          <StatusCapsule label={status.label} className={status.className} />
        </div>

        {/* Delivery info */}
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <CalendarDays
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Delivery date</p>
              <p className="font-medium">{formatDate(order.deliveryDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Delivery address</p>
              <p className="font-medium wrap-break-words">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {order.message ? (
          <p className="text-muted-foreground text-sm">
            Note: <span className="text-foreground">{order.message}</span>
          </p>
        ) : null}

        {/* Footer */}
        <div className="border-border mt-auto flex flex-wrap items-end justify-between gap-3 border-t pt-3">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="size-3.5" aria-hidden="true" />
            Requested {formatDate(order.createdAt)}
          </span>

          {/* Cancel শুধু pending order এর জন্য */}
          {order.status === "pending" && <CancelOrderBtn order={order} />}
        </div>
      </div>
    </article>
  );
};

const MyOrdersPage = async () => {
  const token = await getTokenFromServer();

  if (!token) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile(token);

  if (profile.role !== "customer") {
    redirect("/");
  }

  const orders: IOrder[] = await getMyOrders(token);

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const accepted = orders.filter((o) => o.status === "accepted").length;
  const rejected = orders.filter((o) => o.status === "rejected").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

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
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          My Orders
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Track your pizza orders from request to delivery. You can cancel
          orders that are still pending.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
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
            </div>
          );
        })}
      </div>

      {/* Orders list */}
      {total > 0 ? (
        <Card className="gap-0 py-0">
          <div className="border-border flex flex-col gap-1 border-b px-4 py-4">
            <h2 className="font-heading text-base font-medium">
              Order history
            </h2>
            <p className="text-muted-foreground text-sm">
              {total} orders · {pending} pending · {accepted} accepted ·{" "}
              {rejected} rejected
              {cancelled > 0 ? ` · ${cancelled} cancelled` : ""}
            </p>
          </div>
          <CardContent className="space-y-4 p-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 py-0">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-base font-semibold">
                No orders yet
              </h2>
              <p className="text-muted-foreground text-sm">
                Browse the menu and place your first pizza order.
              </p>
            </div>
            <Link
              href="/browse-menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-1 h-10 bg-(image:--gradient-primary) text-white hover:opacity-90",
              )}
            >
              Browse Menu
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyOrdersPage;
