import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { cn } from "cn";
import { IOrder, OrderStatus } from "@/types/order.type";
import { getOrdersByEmail } from "@/lib/api/orders";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CancelOrderBtn from "@/components/customer/CancelOrderBtn";


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

const OrderCard =  ({ order }: { order: IOrder }) => {
  const status = statusStyles[order.status as OrderStatus];


  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-stretch sm:gap-5">
      {/* Thumbnail */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-auto sm:w-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={order.itemImage}
          alt={order.itemName}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Top row — title + status */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading truncate text-base font-semibold">
                {order.itemName}
              </h3>
              <Badge variant="outline" className="text-[11px]">
                {order.itemCategory}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <Utensils className="size-3.5" aria-hidden="true" />
              {order.vendorName}
              <span aria-hidden="true">·</span>
              <span>#{order.itemId}</span>
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
              <p className="font-medium">{order.deliveryDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Delivery address</p>
              <p className="font-medium wrap-break-word">
                {order.deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Footer row — price + actions */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-border pt-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="text-muted-foreground">
              Qty{" "}
              <span className="text-foreground font-medium">
                {order.quantity}
              </span>
            </span>
            <span className="font-heading text-primary font-bold">
              ${order.totalAmount.toFixed(2)}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="size-3.5" aria-hidden="true" />
              Requested {order.requestedAt?.$date?.slice(0, 10) ?? ""}
            </span>
          </div>

          {/* Cancel is only available for pending orders */}
          {order.status === "pending" && (
            <CancelOrderBtn order={order}/>
          )}
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Page                                          */
/* -------------------------------------------------------------------------- */

const MyOrdersPage = async() => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const orders: IOrder[] = await getOrdersByEmail(user?.email as string);
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
              className="rounded-xl border border-border bg-card px-4 py-3 shadow-xs"
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
          <div className="flex flex-col gap-1 border-b border-border px-4 py-4">
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
              <OrderCard key={order.itemId} order={order} />
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
              href="/menu"
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
