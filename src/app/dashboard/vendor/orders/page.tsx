import { getOrdersByVendorEmail } from "@/lib/api/orders";
import { auth } from "@/lib/auth";
import { IOrder, OrderStatus } from "@/types/order.type";
import { headers } from "next/headers";
import {
  Clock,
  CookingPot,
  Mail,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusCapsule from "@/components/shared/StatusCapsule";
import { cn } from "cn";

/* -------------------------------------------------------------------------- */
/*                          Status config (shared)                            */
/* -------------------------------------------------------------------------- */

/**
 * Visual style for each order status — same tones used across the vendor
 * dashboard so the status capsules always look consistent.
 */
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

/* -------------------------------------------------------------------------- */
/*                          Action buttons (UI only)                          */
/* -------------------------------------------------------------------------- */

/**
 * Accept / Reject buttons — placeholders only, no API wired up yet.
 * When you implement functionality, gate them on `order.status === "pending"`.
 */
const OrderActions = () => (
  <div className="flex items-center gap-2">
    <Button type="button" variant="destructive" size="sm" className="cursor-pointer">
      <XCircle aria-hidden="true" />
      Reject
    </Button>
    <Button
      type="button"
      size="sm"
      className="cursor-pointer bg-(image:--gradient-primary) text-white hover:opacity-90"
    >
      <CookingPot aria-hidden="true" />
      Accept
    </Button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                              Page                                          */
/* -------------------------------------------------------------------------- */

const OrderPage = async () => {
  // 1) Get the signed-in vendor.
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  // 2) Fetch only this vendor's orders.
  const myOrders: IOrder[] = await getOrdersByVendorEmail(user?.email as string);

  // 3) Count orders per status for the stat cards.
  const total = myOrders.length;
  const pending = myOrders.filter((o) => o.status === "pending").length;
  const accepted = myOrders.filter((o) => o.status === "accepted").length;
  const rejected = myOrders.filter((o) => o.status === "rejected").length;

  // 4) Stat cards data.
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

  // "YYYY-MM-DD" -> "20 Nov 2026"
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="w-full px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Customer Orders
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Review and manage orders placed for your menu items. Accept or reject
          pending orders.
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

      {/* Orders list / empty state */}
      {total > 0 ? (
        <Card className="gap-0 py-0">
          {/* Card header */}
          <div className="flex flex-col gap-1 border-b border-border px-4 py-4">
            <h2 className="font-heading text-base font-medium">
              Orders for your items
            </h2>
            <p className="text-muted-foreground text-sm">
              {total} orders · {pending} pending · {accepted} accepted ·{" "}
              {rejected} rejected
            </p>
          </div>

          {/* Desktop — table */}
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-xs tracking-wide uppercase">
                  Customer
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Item
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Delivery
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Total
                </TableHead>
                <TableHead className="text-xs tracking-wide uppercase">
                  Status
                </TableHead>
                <TableHead className="pr-4 text-right text-xs tracking-wide uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {myOrders.map((order, index) => {
                const status = statusStyles[order.status ?? "pending"];
                const customerInitial = (order.userName ?? "?")
                  .charAt(0)
                  .toUpperCase();

                return (
                  <TableRow key={order._id?.$oid ?? index}>
                    {/* Customer */}
                    <TableCell className="py-3 pl-4 align-middle whitespace-normal">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar className="size-9 shrink-0">
                          <AvatarFallback
                            className="font-heading text-xs font-bold text-white"
                            style={{ background: "var(--gradient-primary)" }}
                          >
                            {customerInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-heading truncate text-sm font-semibold">
                            {order.userName}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Mail className="size-3" aria-hidden="true" />
                            {order.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Item */}
                    <TableCell className="py-3 align-middle whitespace-normal">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.itemImage}
                            alt={order.itemName}
                            className="size-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading truncate text-sm font-semibold">
                            {order.itemName}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <Badge variant="outline" className="text-[11px]">
                              {order.itemCategory}
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                              Qty {order.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Delivery */}
                    <TableCell className="py-3 align-middle whitespace-normal">
                      <p className="font-medium">{formatDate(order.deliveryDate)}</p>
                      <p className="text-muted-foreground wrap-break-word text-xs">
                        {order.deliveryAddress}
                      </p>
                    </TableCell>

                    {/* Total */}
                    <TableCell className="py-3 align-middle whitespace-nowrap">
                      <span className="font-heading text-primary font-bold">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      {order.message && (
                        <p className="text-muted-foreground mt-0.5 max-w-40 truncate text-xs italic">
                          “{order.message}”
                        </p>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3 align-middle">
                      <StatusCapsule
                        label={status.label}
                        className={status.className}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 pr-4 align-middle">
                      <div className="flex justify-end">
                        <OrderActions />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Mobile — card list */}
          <CardContent className="space-y-3 p-4 md:hidden">
            {myOrders.map((order, index) => {
              const status = statusStyles[order.status ?? "pending"];
              return (
                <div
                  key={order._id?.$oid ?? index}
                  className="rounded-xl border border-border p-3"
                >
                  {/* Customer + status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar className="size-9 shrink-0">
                        <AvatarFallback
                          className="font-heading text-xs font-bold text-white"
                          style={{ background: "var(--gradient-primary)" }}
                        >
                          {(order.userName ?? "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-heading truncate text-sm font-semibold">
                          {order.userName}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {order.userEmail}
                        </p>
                      </div>
                    </div>
                    <StatusCapsule
                      label={status.label}
                      className={status.className}
                    />
                  </div>

                  {/* Item */}
                  <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-muted/60 p-2.5">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.itemImage}
                        alt={order.itemName}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading truncate text-sm font-semibold">
                          {order.itemName}
                        </p>
                        <Badge variant="outline" className="text-[11px]">
                          {order.itemCategory}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        Qty {order.quantity} ·{" "}
                        <span className="font-heading text-primary font-bold">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Delivery + actions */}
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                    <div className="text-muted-foreground text-xs">
                      <p>Delivery {formatDate(order.deliveryDate)}</p>
                      <p className="text-muted-foreground mt-0.5 wrap-break-word">
                        {order.deliveryAddress}
                      </p>
                    </div>
                    <OrderActions />
                  </div>
                </div>
              );
            })}
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
                Orders placed for your menu items will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderPage;